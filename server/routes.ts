import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { requireAdmin } from "./middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin-only routes
  app.get("/api/admin/stats", requireAdmin, (_req, res) => {
    res.json({ message: "Admin only stats" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
