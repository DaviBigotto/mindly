import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isPro: boolean("is_pro").default(false).notNull(),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  dailyJournalCount: integer("daily_journal_count").default(0).notNull(),
  lastJournalDate: timestamp("last_journal_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Journal entries with AI mood analysis
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  aiAnalysis: text("ai_analysis"),
  mood: varchar("mood", { length: 20 }), // positive, neutral, negative
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
  user: one(users, {
    fields: [journalEntries.userId],
    references: [users.id],
  }),
}));

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

// Meditation categories and sessions
export const meditationCategories = pgTable("meditation_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isPro: boolean("is_pro").default(false).notNull(),
  icon: varchar("icon", { length: 50 }), // lucide icon name
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MeditationCategory = typeof meditationCategories.$inferSelect;

export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => meditationCategories.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  audioUrl: varchar("audio_url"), // placeholder for now
  isPro: boolean("is_pro").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meditationSessionsRelations = relations(meditationSessions, ({ one }) => ({
  category: one(meditationCategories, {
    fields: [meditationSessions.categoryId],
    references: [meditationCategories.id],
  }),
}));

export type MeditationSession = typeof meditationSessions.$inferSelect;

// User meditation history
export const meditationHistory = pgTable("meditation_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionId: varchar("session_id").notNull().references(() => meditationSessions.id, { onDelete: 'cascade' }),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const meditationHistoryRelations = relations(meditationHistory, ({ one }) => ({
  user: one(users, {
    fields: [meditationHistory.userId],
    references: [users.id],
  }),
  session: one(meditationSessions, {
    fields: [meditationHistory.sessionId],
    references: [meditationSessions.id],
  }),
}));

export type MeditationHistoryEntry = typeof meditationHistory.$inferSelect;

// Focus mode sessions
export const focusSessions = pgTable("focus_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  duration: integer("duration").notNull(), // in minutes
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  user: one(users, {
    fields: [focusSessions.userId],
    references: [users.id],
  }),
}));

export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({
  id: true,
  completedAt: true,
  date: true,
});

export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type FocusSession = typeof focusSessions.$inferSelect;

// Pro transformation tracks
export const proTracks = pgTable("pro_tracks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // total days
  icon: varchar("icon", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProTrack = typeof proTracks.$inferSelect;

// Track steps/days
export const trackSteps = pgTable("track_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackId: varchar("track_id").notNull().references(() => proTracks.id, { onDelete: 'cascade' }),
  dayNumber: integer("day_number").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  activityType: varchar("activity_type", { length: 50 }), // audio, text, breathing
  estimatedMinutes: integer("estimated_minutes"),
  content: text("content"), // instructions or text content
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trackStepsRelations = relations(trackSteps, ({ one }) => ({
  track: one(proTracks, {
    fields: [trackSteps.trackId],
    references: [proTracks.id],
  }),
}));

export type TrackStep = typeof trackSteps.$inferSelect;

// User track progress
export const userTrackProgress = pgTable("user_track_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  trackId: varchar("track_id").notNull().references(() => proTracks.id, { onDelete: 'cascade' }),
  stepId: varchar("step_id").notNull().references(() => trackSteps.id, { onDelete: 'cascade' }),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const userTrackProgressRelations = relations(userTrackProgress, ({ one }) => ({
  user: one(users, {
    fields: [userTrackProgress.userId],
    references: [users.id],
  }),
  track: one(proTracks, {
    fields: [userTrackProgress.trackId],
    references: [proTracks.id],
  }),
  step: one(trackSteps, {
    fields: [userTrackProgress.stepId],
    references: [trackSteps.id],
  }),
}));

export type UserTrackProgress = typeof userTrackProgress.$inferSelect;

// Premium sounds library
export const premiumSounds = pgTable("premium_sounds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // nature, binaural, tones
  audioUrl: varchar("audio_url").notNull(), // placeholder for now
  duration: integer("duration").notNull(), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PremiumSound = typeof premiumSounds.$inferSelect;
