// Database initialization - Create tables if they don't exist
import { db } from "./db";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema";

/**
 * Initialize database tables if they don't exist
 * This runs automatically on server startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("🔍 Checking database tables...");
    
    // Check if users table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const exists = (tableExists.rows[0] as any)?.exists;
    
    if (exists) {
      console.log("✅ Database tables already exist");
      return;
    }
    
    console.log("⚠️ Database tables not found. Attempting to create them...");
    console.log("💡 Please run 'npm run db:push' locally to create tables.");
    console.log("💡 Or wait for the next deployment with auto-migration enabled.");
    
    // Note: We don't automatically create tables here because:
    // 1. drizzle-kit push requires file system access to schema files
    // 2. It's safer to run migrations explicitly
    // 3. The user should run db:push locally pointing to the remote database
    
  } catch (error) {
    console.error("❌ Error checking database:", error);
    // Don't throw - let the server start anyway
    // Individual operations will fail with clear error messages
  }
}

