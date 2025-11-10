// Replit Auth integration - javascript_log_in_with_replit blueprint
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const authDisabled =
  !process.env.REPL_ID ||
  !process.env.ISSUER_URL ||
  process.env.DISABLE_AUTH === "true";

const devUserClaims = {
  sub: "dev-user",
  email: process.env.DEV_USER_EMAIL ?? "demo@mindly.app",
  first_name: process.env.DEV_USER_FIRST_NAME ?? "Mindly",
  last_name: process.env.DEV_USER_LAST_NAME ?? "Dev",
  profile_image_url: process.env.DEV_USER_AVATAR ?? "",
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
};

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  if (authDisabled) {
    throw new Error("Session store should not be used when auth is disabled");
  }
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  if (authDisabled) {
    // Middleware to handle user authentication in dev mode
    // Checks for X-User-Email header to identify the logged-in user
    app.use(async (req, _res, next) => {
      // Check if there's a user email in the request headers (set by frontend)
      const userEmail = req.headers["x-user-email"] as string | undefined;
      
      let userClaims = devUserClaims;
      
      if (userEmail) {
        // Try to find user by email in database
        const existingUser = await storage.getUserByEmail(userEmail);
        if (existingUser) {
          // Use existing user's data
          userClaims = {
            sub: existingUser.id,
            email: existingUser.email,
            first_name: existingUser.firstName || "User",
            last_name: existingUser.lastName || "",
            profile_image_url: existingUser.profileImageUrl || "",
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
          };
        } else {
          // Create user claims from email
          userClaims = {
            sub: `user-${userEmail.replace(/[^a-zA-Z0-9]/g, "-")}`,
            email: userEmail,
            first_name: "User",
            last_name: "",
            profile_image_url: "",
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
          };
        }
      }
      
      const user = (req as any).user ?? { claims: userClaims };
      (req as any).user = user;
      
      // Upsert user to ensure it exists in database
      // If user exists, preserve their data; otherwise create new user
      const existingUser = await storage.getUserByEmail(user.claims.email);
      if (existingUser) {
        // Update user claims with existing data to preserve Pro status, etc.
        user.claims.sub = existingUser.id;
        user.claims.first_name = existingUser.firstName || user.claims.first_name;
        user.claims.last_name = existingUser.lastName || user.claims.last_name;
        user.claims.profile_image_url = existingUser.profileImageUrl || user.claims.profile_image_url;
        (req as any).user = { claims: user.claims };
      } else {
        // Create new user
        await storage.upsertUser({
          id: user.claims.sub,
          email: user.claims.email,
          firstName: user.claims.first_name,
          lastName: user.claims.last_name,
          profileImageUrl: user.claims.profile_image_url,
        });
      }
      
      next();
    });

    app.get("/api/login", (_req, res) => res.redirect("/"));
    app.get("/api/logout", (_req, res) => res.redirect("/"));
    app.get("/api/callback", (_req, res) => res.redirect("/"));
    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Keep track of registered strategies
  const registeredStrategies = new Set<string>();

  // Helper function to ensure strategy exists for a domain
  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (authDisabled) {
    if (!(req as any).user) {
      (req as any).user = { claims: devUserClaims };
    }
    return next();
  }
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
