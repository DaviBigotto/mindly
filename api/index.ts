// Vercel Serverless Function wrapper for Express app
// This file adapts the Express app to work with Vercel's serverless functions

import serverless from "serverless-http";
import express from "express";
import { registerRoutes } from "../server/routes";
import { setupAuth } from "../server/replitAuth";
import { serveStatic } from "../server/vite";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup auth and routes
(async () => {
  await setupAuth(app);
  registerRoutes(app);
  
  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }
})();

// Export as serverless function
export default serverless(app);

