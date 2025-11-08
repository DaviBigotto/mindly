// API routes implementation
import type { Express } from "express";
import { storage } from "./storage";
import { analyzeMood } from "./openai";
import { isAuthenticated } from "./replitAuth";
import { insertJournalEntrySchema, insertFocusSessionSchema } from "@shared/schema";
import Stripe from "stripe";

// Stripe integration - javascript_stripe blueprint
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function registerRoutes(app: Express) {
  // Get current user info
  app.get("/api/user", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const user = await storage.getUser(userClaims.sub);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isPro: user.isPro,
        dailyJournalCount: user.dailyJournalCount,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Journal entries - create with AI analysis
  app.post("/api/journal", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const userId = userClaims.sub;

      // Reset daily count if needed
      await storage.resetDailyJournalCountIfNeeded(userId);

      // Get user to check limits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check free tier limits (2 AI analyses per day)
      if (!user.isPro && user.dailyJournalCount >= 2) {
        return res.status(403).json({ 
          message: "Daily limit reached",
          requiresPro: true 
        });
      }

      const body = insertJournalEntrySchema.parse(req.body);

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

      res.json(entry);
    } catch (error: any) {
      console.error("Error creating journal entry:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      res.status(500).json({ message: "Failed to create journal entry" });
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

  // Stripe subscription - Get or create subscription - javascript_stripe blueprint
  app.post("/api/get-or-create-subscription", isAuthenticated, async (req, res) => {
    try {
      const userClaims = (req.user as any).claims;
      const user = await storage.getUser(userClaims.sub);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let customerId = user.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: "Mindly Pro",
                description: "Acesso ilimitado a meditações, IA emocional e trilhas de transformação",
              },
              unit_amount: 2990, // R$ 29,90 in cents
              recurring: {
                interval: "month",
              },
            },
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
      });

      // Update user with Stripe info
      await storage.updateUserStripeInfo(
        user.id,
        customerId,
        subscription.id
      );

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
}
