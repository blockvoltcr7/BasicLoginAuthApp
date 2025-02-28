import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Allow access to password reset related routes without authentication
  if (
    req.path.startsWith("/verify") ||
    req.path.startsWith("/reset-password") ||
    req.path.startsWith("/forgot-password")
  ) {
    return next();
  }

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}