// API routes implementation
import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { analyzeMood } from "./openai"; // Análise de sentimento local (não usa OpenAI)
import { isAuthenticated } from "./replitAuth";
import { insertJournalEntrySchema, insertFocusSessionSchema, createJournalEntryRequestSchema } from "@shared/schema";

const KIWIFY_WEBHOOK_TOKEN = process.env.KIWIFY_WEBHOOK_TOKEN ?? "SEUTOKENAQUI";
const KIWIFY_PRO_STORAGE_MB = Number(process.env.KIWIFY_PRO_STORAGE_MB ?? "2048");
const KIWIFY_BASIC_STORAGE_MB = Number(process.env.KIWIFY_BASIC_STORAGE_MB ?? "256");

const PLAN_CONFIG = {
  pro: { plan: "pro", isPro: true, storageLimitMb: KIWIFY_PRO_STORAGE_MB },
  basic: { plan: "basic", isPro: false, storageLimitMb: KIWIFY_BASIC_STORAGE_MB },
} as const;

type KiwifyPlanKey = keyof typeof PLAN_CONFIG;

class KiwifyWebhookError extends Error {
  status: number;
  logId?: string;

  constructor(message: string, status = 500, logId?: string) {
    super(message);
    this.status = status;
    this.logId = logId;
  }
}

type KiwifyPayload = {
  email?: string;
  evento?: string;
  produto?: string;
  token?: string;
  [key: string]: unknown;
};

function classifyKiwifyEvent(evento: string | null | undefined): KiwifyPlanKey | "ignored" {
  if (!evento) return "ignored";
  const normalized = evento.toLowerCase();

  if (/(cancel|expir|atras|suspens|falh)/.test(normalized)) {
    return "basic";
  }

  if (/(renov|nova|assinatura|pagamento|aprov|confirm)/.test(normalized)) {
    return "pro";
  }

  return "ignored";
}

async function processKiwifyEvent(
  payload: KiwifyPayload,
  options: { source: "webhook" | "manual"; skipTokenValidation?: boolean } = { source: "webhook" },
) {
  const tokenProvided = typeof payload.token === "string" ? payload.token : undefined;
  const tokenValid = options.skipTokenValidation ? true : tokenProvided === KIWIFY_WEBHOOK_TOKEN;

  const logEntry = await storage.createKiwifyWebhookLog({
    email: (typeof payload.email === "string" && payload.email.trim()) || null,
    evento: (typeof payload.evento === "string" && payload.evento.trim()) || null,
    produto: (typeof payload.produto === "string" && payload.produto.trim()) || null,
    tokenValid,
    processed: false,
    status: options.source === "manual" ? "received_manual" : "received",
    message: options.source === "manual" ? "Evento recebido pelo painel administrativo" : "Evento recebido via webhook",
    payload,
  });

  try {
    if (!tokenValid) {
      await storage.updateKiwifyWebhookLog(logEntry.id, {
        processed: false,
        status: "rejected",
        message: "Token inválido",
      });
      throw new KiwifyWebhookError("Token inválido", 403, logEntry.id);
    }

    const email = (typeof payload.email === "string" && payload.email.trim()) || "";
    if (!email) {
      await storage.updateKiwifyWebhookLog(logEntry.id, {
        processed: false,
        status: "invalid_payload",
        message: "Campo 'email' é obrigatório.",
      });
      throw new KiwifyWebhookError("Campo 'email' é obrigatório.", 400, logEntry.id);
    }

    const evento = (typeof payload.evento === "string" && payload.evento.trim()) || "";
    if (!evento) {
      await storage.updateKiwifyWebhookLog(logEntry.id, {
        processed: false,
        status: "invalid_payload",
        message: "Campo 'evento' é obrigatório.",
      });
      throw new KiwifyWebhookError("Campo 'evento' é obrigatório.", 400, logEntry.id);
    }

    const planKey = classifyKiwifyEvent(evento);

    if (planKey === "ignored") {
      await storage.updateKiwifyWebhookLog(logEntry.id, {
        processed: false,
        status: "ignored",
        message: `Evento ignorado (${evento}).`,
      });
      return {
        outcome: "ignored" as const,
        logId: logEntry.id,
        message: `Evento '${evento}' ignorado.`,
      };
    }

    const planConfig = PLAN_CONFIG[planKey];
    const emailLower = email.toLowerCase();
    
    // Try to find existing user
    let updatedUser = await storage.getUserByEmail(emailLower);
    
    if (!updatedUser) {
      // User doesn't exist, create it with Pro access
      console.log(`Creating new user from Kiwify webhook: ${emailLower}`);
      const userId = `user-${emailLower.replace(/[^a-zA-Z0-9]/g, "-")}`;
      updatedUser = await storage.upsertUser({
        id: userId,
        email: emailLower,
        firstName: "User",
        lastName: "",
        profileImageUrl: "",
        isPro: planConfig.isPro,
        plan: planConfig.plan,
        storageLimitMb: planConfig.storageLimitMb,
      });
      console.log(`New user created: ${updatedUser.id} - ${updatedUser.email}`);
    } else {
      // User exists, update plan
      updatedUser = await storage.updateUserPlanByEmail(
        emailLower,
        planConfig.plan,
        planConfig.storageLimitMb,
        planConfig.isPro,
      );
    }

    if (!updatedUser) {
      await storage.updateKiwifyWebhookLog(logEntry.id, {
        processed: false,
        status: "error",
        message: `Erro ao criar/atualizar usuário com email ${email}.`,
      });
      throw new KiwifyWebhookError("Erro ao processar usuário.", 500, logEntry.id);
    }

    await storage.updateKiwifyWebhookLog(logEntry.id, {
      processed: true,
      status: planConfig.plan === "pro" ? "plan_upgraded" : "plan_downgraded",
      message: `Plano atualizado para ${planConfig.plan}.`,
    });

    return {
      outcome: "processed" as const,
      logId: logEntry.id,
      message: `Plano atualizado para ${planConfig.plan}.`,
      plan: planConfig.plan,
      storageLimitMb: planConfig.storageLimitMb,
    };
  } catch (error) {
    if (error instanceof KiwifyWebhookError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Erro desconhecido";
    await storage.updateKiwifyWebhookLog(logEntry.id, {
      processed: false,
      status: "error",
      message,
    });
    throw new KiwifyWebhookError("Erro ao processar evento da Kiwify.", 500, logEntry.id);
  }
}

export function registerRoutes(app: Express) {
  // Sync user from frontend to backend (for dev mode)
  app.post("/api/users/sync", async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, profileImageUrl, password } = req.body;

      if (!email || typeof email !== "string") {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Email is required" });
      }

      // Generate a consistent ID from email
      const userId = `user-${email.replace(/[^a-zA-Z0-9]/g, "-")}`;

      // Store password as plain text for now (in production, use bcrypt)
      // TODO: Implement password hashing with bcrypt
      const user = await storage.upsertUser({
        id: userId,
        email,
        firstName: firstName || "User",
        lastName: lastName || "",
        profileImageUrl: profileImageUrl || "",
        password: password || undefined, // Store password if provided
      });

      console.log("User synced from frontend:", user.email);

      res.setHeader("Content-Type", "application/json");
      return res.json({
        message: "User synced successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isPro: user.isPro,
          plan: user.plan,
          storageLimitMb: user.storageLimitMb,
        },
      });
    } catch (error) {
      console.error("Error syncing user:", error);
      res.setHeader("Content-Type", "application/json");
      
      // Check if error is related to missing tables
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("relation") && errorMessage.includes("does not exist")) {
        return res.status(500).json({
          message: "Database tables not created. Please run 'npm run db:push' in the Render Shell.",
          error: "Tables missing - run 'npm run db:push' to create them",
          hint: "Go to Render Dashboard → Your Service → Shell → Run: npm run db:push",
        });
      }
      
      return res.status(500).json({
        message: "Failed to sync user",
        error: errorMessage,
      });
    }
  });

  // Login endpoint - validate credentials against database
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Validate password (plain text comparison for now)
      // TODO: Implement password hashing with bcrypt
      if (user.password && user.password !== password) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // If user exists but has no password, allow login (legacy users)
      // This allows existing users to login without password
      if (!user.password) {
        console.log("User found but has no password set:", user.email);
        // Allow login for users without password (legacy support)
      }

      console.log("User logged in:", user.email);

      res.setHeader("Content-Type", "application/json");
      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isPro: user.isPro,
          plan: user.plan,
          storageLimitMb: user.storageLimitMb,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        message: "Failed to login",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  app.post("/api/webhooks/kiwify", async (req: Request, res: Response) => {
    try {
      const result = await processKiwifyEvent(req.body ?? {}, { source: "webhook" });

      if (result.outcome === "ignored") {
        return res.status(202).json({ message: result.message });
      }

      return res.json({
        message: result.message,
        plan: result.plan,
        storageLimitMb: result.storageLimitMb,
      });
    } catch (error) {
      if (error instanceof KiwifyWebhookError) {
        return res.status(error.status).json({ message: error.message });
      }

      console.error("Erro inesperado no webhook da Kiwify:", error);
      return res.status(500).json({ message: "Erro interno ao processar webhook." });
    }
  });

  app.get("/api/admin/kiwify/logs", isAuthenticated, async (_req, res) => {
    try {
      const logs = await storage.getKiwifyWebhookLogs(100);
      res.json(logs);
    } catch (error) {
      console.error("Erro ao buscar logs da Kiwify:", error);
      res.status(500).json({ message: "Erro ao buscar logs da Kiwify." });
    }
  });

  app.post("/api/admin/kiwify/simulate", isAuthenticated, async (req, res) => {
    try {
      const result = await processKiwifyEvent(req.body ?? {}, {
        source: "manual",
        skipTokenValidation: true,
      });

      res.json({
        message: result.message,
        outcome: result.outcome,
        plan: result.plan,
        storageLimitMb: result.storageLimitMb,
      });
    } catch (error) {
      if (error instanceof KiwifyWebhookError) {
        return res.status(error.status).json({ message: error.message });
      }

      console.error("Erro ao simular evento da Kiwify:", error);
      res.status(500).json({ message: "Erro interno ao simular evento." });
    }
  });

  // Get current user info
  app.get("/api/user", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Handle both auth modes: with claims or direct user object
      let userId: string;
      if (user?.claims?.sub) {
        userId = user.claims.sub;
      } else if (user?.sub) {
        userId = user.sub;
      } else if (user?.id) {
        userId = user.id;
      } else {
        console.error("User ID not found in request:", { user });
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ 
          message: "User ID not found",
          error: "Unable to identify user from session"
        });
      }

      const dbUser = await storage.getUser(userId);
      
      if (!dbUser) {
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({ message: "User not found" });
      }

      // Explicitly set Content-Type header
      res.setHeader("Content-Type", "application/json");
      
      return res.json({
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
        isPro: dbUser.isPro,
        plan: dbUser.plan,
        storageLimitMb: dbUser.storageLimitMb,
        dailyJournalCount: dbUser.dailyJournalCount,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ 
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin route: Grant Pro access to current user
  app.post("/api/admin/grant-pro", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Handle both auth modes: with claims or direct user object
      let userId: string;
      if (user?.claims?.sub) {
        userId = user.claims.sub;
      } else if (user?.sub) {
        userId = user.sub;
      } else if (user?.id) {
        userId = user.id;
      } else {
        console.error("User ID not found in request:", { user });
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ 
          message: "User ID not found",
          error: "Unable to identify user from session"
        });
      }

      console.log("Granting Pro access to user:", userId);

      const updatedUser = await storage.updateUserPlanById(
        userId,
        "pro",
        KIWIFY_PRO_STORAGE_MB,
        true
      );

      if (!updatedUser) {
        console.error("User not found in database:", userId);
        res.setHeader("Content-Type", "application/json");
        return res.status(404).json({ 
          message: "User not found",
          userId 
        });
      }

      console.log("Pro access granted successfully to user:", updatedUser.email);

      // Explicitly set Content-Type header
      res.setHeader("Content-Type", "application/json");
      
      return res.json({
        message: "Pro access granted successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          isPro: updatedUser.isPro,
          plan: updatedUser.plan,
          storageLimitMb: updatedUser.storageLimitMb,
        },
      });
    } catch (error) {
      console.error("Error granting Pro access:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to grant Pro access";
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ 
        message: "Failed to grant Pro access",
        error: errorMessage
      });
    }
  });

  // Journal entries - create with AI analysis
  app.post("/api/journal", isAuthenticated, async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");
      
      const user = req.user as any;
      
      // Handle both auth modes: with claims or direct user object
      let userId: string;
      if (user?.claims?.sub) {
        userId = user.claims.sub;
      } else if (user?.sub) {
        userId = user.sub;
      } else if (user?.id) {
        userId = user.id;
      } else {
        console.error("User ID not found in request:", { user });
        return res.status(400).json({ 
          message: "User ID not found",
          error: "Unable to identify user from session"
        });
      }

      // Reset daily count if needed
      await storage.resetDailyJournalCountIfNeeded(userId);

      // Get user to check limits
      const dbUser = await storage.getUser(userId);
      if (!dbUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check free tier limits (2 AI analyses per day)
      if (!dbUser.isPro && dbUser.dailyJournalCount >= 2) {
        return res.status(403).json({ 
          message: "Daily limit reached",
          requiresPro: true 
        });
      }

      // Validate request body (only content is expected from frontend)
      const body = createJournalEntryRequestSchema.parse(req.body);

      // Analyze mood with AI
      const { mood, analysis } = await analyzeMood(body.content);

      // Create journal entry
      const entry = await storage.createJournalEntry({
        userId,
        content: body.content,
        mood,
        aiAnalysis: analysis,
      });

      // Increment daily count
      await storage.incrementDailyJournalCount(userId);

      return res.json(entry);
    } catch (error: any) {
      console.error("Error creating journal entry:", error);
      res.setHeader("Content-Type", "application/json");
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      return res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  // Get journal entries
  app.get("/api/journal", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const entries = await storage.getJournalEntries(userClaims.sub);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Get meditation categories
  app.get("/api/meditation/categories", isAuthenticated, async (req, res) => {
    try {
      const categories = await storage.getMeditationCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching meditation categories:", error);
      res.status(500).json({ message: "Failed to fetch meditation categories" });
    }
  });

  // Get meditation sessions by category
  app.get("/api/meditation/sessions/:categoryId", isAuthenticated, async (req, res) => {
    try {
      const { categoryId } = req.params;
      const sessions = await storage.getMeditationSessionsByCategory(categoryId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching meditation sessions:", error);
      res.status(500).json({ message: "Failed to fetch meditation sessions" });
    }
  });

  // Complete meditation session
  app.post("/api/meditation/complete", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const entry = await storage.createMeditationHistory(userClaims.sub, sessionId);
      res.json(entry);
    } catch (error) {
      console.error("Error completing meditation:", error);
      res.status(500).json({ message: "Failed to complete meditation" });
    }
  });

  // Get meditation history
  app.get("/api/meditation/history", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const history = await storage.getMeditationHistory(userClaims.sub);
      res.json(history);
    } catch (error) {
      console.error("Error fetching meditation history:", error);
      res.status(500).json({ message: "Failed to fetch meditation history" });
    }
  });

  // Complete focus session
  app.post("/api/focus/complete", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const body = insertFocusSessionSchema.parse(req.body);

      const session = await storage.createFocusSession({
        userId: userClaims.sub,
        duration: body.duration,
      });

      res.json(session);
    } catch (error: any) {
      console.error("Error completing focus session:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      res.status(500).json({ message: "Failed to complete focus session" });
    }
  });

  // Get focus sessions
  app.get("/api/focus", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const sessions = await storage.getFocusSessions(userClaims.sub);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching focus sessions:", error);
      res.status(500).json({ message: "Failed to fetch focus sessions" });
    }
  });

  // Get Pro tracks
  app.get("/api/pro-tracks", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const user = await storage.getUser(userClaims.sub);

      if (!user?.isPro) {
        return res.status(403).json({ message: "Pro subscription required" });
      }

      const tracks = await storage.getProTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching Pro tracks:", error);
      res.status(500).json({ message: "Failed to fetch Pro tracks" });
    }
  });

  // Get track steps
  app.get("/api/pro-tracks/:trackId/steps", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const user = await storage.getUser(userClaims.sub);

      if (!user?.isPro) {
        return res.status(403).json({ message: "Pro subscription required" });
      }

      const { trackId } = req.params;
      const steps = await storage.getTrackSteps(trackId);
      res.json(steps);
    } catch (error) {
      console.error("Error fetching track steps:", error);
      res.status(500).json({ message: "Failed to fetch track steps" });
    }
  });

  // Mark track step complete
  app.post("/api/pro-tracks/:trackId/steps/:stepId/complete", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const user = await storage.getUser(userClaims.sub);

      if (!user?.isPro) {
        return res.status(403).json({ message: "Pro subscription required" });
      }

      const { trackId, stepId } = req.params;
      const progress = await storage.markStepComplete(userClaims.sub, trackId, stepId);
      res.json(progress);
    } catch (error) {
      console.error("Error marking step complete:", error);
      res.status(500).json({ message: "Failed to mark step complete" });
    }
  });

  // Get user track progress
  app.get("/api/pro-tracks/:trackId/progress", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const { trackId } = req.params;
      const progress = await storage.getUserTrackProgress(userClaims.sub, trackId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching track progress:", error);
      res.status(500).json({ message: "Failed to fetch track progress" });
    }
  });

  // Get premium sounds
  app.get("/api/sounds/premium", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const user = await storage.getUser(userClaims.sub);

      if (!user?.isPro) {
        return res.status(403).json({ message: "Pro subscription required" });
      }

      const sounds = await storage.getPremiumSounds();
      res.json(sounds);
    } catch (error) {
      console.error("Error fetching premium sounds:", error);
      res.status(500).json({ message: "Failed to fetch premium sounds" });
    }
  });

  // Get profile stats
  app.get("/api/profile/stats", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const stats = await storage.getProfileStats(userClaims.sub);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      res.status(500).json({ message: "Failed to fetch profile stats" });
    }
  });

  // (stripe payment flow removido)
}
