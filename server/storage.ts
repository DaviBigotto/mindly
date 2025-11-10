// Database storage implementation - javascript_database & javascript_log_in_with_replit blueprints
import {
  users,
  journalEntries,
  meditationCategories,
  meditationSessions,
  meditationHistory,
  focusSessions,
  proTracks,
  trackSteps,
  userTrackProgress,
  premiumSounds,
  type User,
  type UpsertUser,
  type JournalEntry,
  type InsertJournalEntry,
  type MeditationCategory,
  type MeditationSession,
  type MeditationHistoryEntry,
  type FocusSession,
  type InsertFocusSession,
  type ProTrack,
  type TrackStep,
  type UserTrackProgress,
  type PremiumSound,
  kiwifyWebhookLogs,
  type KiwifyWebhookLog,
  type InsertKiwifyWebhookLog,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserPlanByEmail(email: string, plan: string, storageLimitMb: number, isPro: boolean): Promise<User | undefined>;
  updateUserPlanById(userId: string, plan: string, storageLimitMb: number, isPro: boolean): Promise<User | undefined>;
  
  // Webhook logs
  createKiwifyWebhookLog(log: InsertKiwifyWebhookLog): Promise<KiwifyWebhookLog>;
  updateKiwifyWebhookLog(
    id: string,
    data: Partial<Pick<KiwifyWebhookLog, "processed" | "status" | "message">>,
  ): Promise<KiwifyWebhookLog | undefined>;
  getKiwifyWebhookLogs(limit?: number): Promise<KiwifyWebhookLog[]>;
  
  // Journal operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  incrementDailyJournalCount(userId: string): Promise<void>;
  resetDailyJournalCountIfNeeded(userId: string): Promise<void>;
  
  // Meditation operations
  getMeditationCategories(): Promise<MeditationCategory[]>;
  getMeditationSessionsByCategory(categoryId: string): Promise<MeditationSession[]>;
  createMeditationHistory(userId: string, sessionId: string): Promise<MeditationHistoryEntry>;
  getMeditationHistory(userId: string): Promise<MeditationHistoryEntry[]>;
  
  // Focus operations
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  getFocusSessions(userId: string): Promise<FocusSession[]>;
  
  // Pro tracks operations
  getProTracks(): Promise<ProTrack[]>;
  getTrackSteps(trackId: string): Promise<TrackStep[]>;
  markStepComplete(userId: string, trackId: string, stepId: string): Promise<UserTrackProgress>;
  getUserTrackProgress(userId: string, trackId: string): Promise<UserTrackProgress[]>;
  
  // Premium sounds
  getPremiumSounds(): Promise<PremiumSound[]>;
  
  // Profile stats
  getProfileStats(userId: string): Promise<{
    journalCount: number;
    meditationMinutes: number;
    focusCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPlanByEmail(
    email: string,
    plan: string,
    storageLimitMb: number,
    isPro: boolean,
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        plan,
        storageLimitMb,
        isPro,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email))
      .returning();
    return user;
  }

  async updateUserPlanById(
    userId: string,
    plan: string,
    storageLimitMb: number,
    isPro: boolean,
  ): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        plan,
        storageLimitMb,
        isPro,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createKiwifyWebhookLog(log: InsertKiwifyWebhookLog): Promise<KiwifyWebhookLog> {
    const [entry] = await db.insert(kiwifyWebhookLogs).values(log).returning();
    return entry;
  }

  async updateKiwifyWebhookLog(
    id: string,
    data: Partial<Pick<KiwifyWebhookLog, "processed" | "status" | "message">>,
  ): Promise<KiwifyWebhookLog | undefined> {
    const [entry] = await db
      .update(kiwifyWebhookLogs)
      .set(data)
      .where(eq(kiwifyWebhookLogs.id, id))
      .returning();
    return entry;
  }

  async getKiwifyWebhookLogs(limit = 50): Promise<KiwifyWebhookLog[]> {
    return await db
      .select()
      .from(kiwifyWebhookLogs)
      .orderBy(desc(kiwifyWebhookLogs.createdAt))
      .limit(limit);
  }

  // Journal operations
  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [journalEntry] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return journalEntry;
  }

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async incrementDailyJournalCount(userId: string): Promise<void> {
    await db
      .update(users)
      .set({
        dailyJournalCount: sql`${users.dailyJournalCount} + 1`,
        lastJournalDate: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async resetDailyJournalCountIfNeeded(userId: string): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user && user.lastJournalDate) {
      const lastDate = new Date(user.lastJournalDate);
      const today = new Date();
      if (lastDate.toDateString() !== today.toDateString()) {
        await db
          .update(users)
          .set({ dailyJournalCount: 0 })
          .where(eq(users.id, userId));
      }
    }
  }

  // Meditation operations
  async getMeditationCategories(): Promise<MeditationCategory[]> {
    return await db.select().from(meditationCategories);
  }

  async getMeditationSessionsByCategory(categoryId: string): Promise<MeditationSession[]> {
    return await db
      .select()
      .from(meditationSessions)
      .where(eq(meditationSessions.categoryId, categoryId));
  }

  async createMeditationHistory(userId: string, sessionId: string): Promise<MeditationHistoryEntry> {
    const [entry] = await db
      .insert(meditationHistory)
      .values({ userId, sessionId })
      .returning();
    return entry;
  }

  async getMeditationHistory(userId: string): Promise<MeditationHistoryEntry[]> {
    return await db
      .select()
      .from(meditationHistory)
      .where(eq(meditationHistory.userId, userId))
      .orderBy(desc(meditationHistory.completedAt));
  }

  // Focus operations
  async createFocusSession(session: InsertFocusSession): Promise<FocusSession> {
    const [focusSession] = await db
      .insert(focusSessions)
      .values(session)
      .returning();
    return focusSession;
  }

  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    return await db
      .select()
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId))
      .orderBy(desc(focusSessions.completedAt));
  }

  // Pro tracks operations
  async getProTracks(): Promise<ProTrack[]> {
    return await db.select().from(proTracks);
  }

  async getTrackSteps(trackId: string): Promise<TrackStep[]> {
    return await db
      .select()
      .from(trackSteps)
      .where(eq(trackSteps.trackId, trackId))
      .orderBy(trackSteps.dayNumber);
  }

  async markStepComplete(userId: string, trackId: string, stepId: string): Promise<UserTrackProgress> {
    const [progress] = await db
      .insert(userTrackProgress)
      .values({ userId, trackId, stepId })
      .returning();
    return progress;
  }

  async getUserTrackProgress(userId: string, trackId: string): Promise<UserTrackProgress[]> {
    return await db
      .select()
      .from(userTrackProgress)
      .where(
        and(
          eq(userTrackProgress.userId, userId),
          eq(userTrackProgress.trackId, trackId)
        )
      );
  }

  // Premium sounds
  async getPremiumSounds(): Promise<PremiumSound[]> {
    return await db.select().from(premiumSounds);
  }

  // Profile stats
  async getProfileStats(userId: string): Promise<{
    journalCount: number;
    meditationMinutes: number;
    focusCount: number;
  }> {
    const [journalCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId));

    const meditationHistoryResults = await db
      .select({ duration: meditationSessions.duration })
      .from(meditationHistory)
      .innerJoin(meditationSessions, eq(meditationHistory.sessionId, meditationSessions.id))
      .where(eq(meditationHistory.userId, userId));

    const [focusCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(focusSessions)
      .where(eq(focusSessions.userId, userId));

    const meditationMinutes = meditationHistoryResults.reduce((sum, record) => sum + (record.duration || 0), 0);

    return {
      journalCount: Number(journalCountResult.count),
      meditationMinutes,
      focusCount: Number(focusCountResult.count),
    };
  }
}

export const storage = new DatabaseStorage();
