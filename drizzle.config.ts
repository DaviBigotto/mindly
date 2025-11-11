import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

// Parse DATABASE_URL to check if SSL is needed
const databaseUrl = process.env.DATABASE_URL;
const isLocalConnection = /localhost|127\.0\.0\.1/.test(databaseUrl);

// For Render PostgreSQL and other cloud databases, add SSL parameters
// If DATABASE_URL doesn't already have sslmode, add it
let connectionUrl = databaseUrl;
if (!isLocalConnection && !databaseUrl.includes("sslmode=")) {
  // Add sslmode=require to the connection string
  const separator = databaseUrl.includes("?") ? "&" : "?";
  connectionUrl = `${databaseUrl}${separator}sslmode=require`;
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionUrl,
  },
});
