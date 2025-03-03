import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Only allow specific auth-related routes to bypass authentication
  const publicRoutes = [
    '/api/verify',
    '/api/reset-password',
    '/api/forgot-password',
    '/api/login',
    '/api/register',
    '/api/magic-link'
  ];

  // Check if the exact route is in our public routes list
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Ensure session is valid
  if (!req.session || !req.isAuthenticated()) {
    console.log('[Auth Middleware] Unauthorized access attempt:', {
      path: req.path,
      method: req.method,
      hasSession: !!req.session,
      isAuthenticated: req.isAuthenticated()
    });
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.isAuthenticated()) {
    console.log('[Admin Middleware] Unauthorized access attempt:', {
      path: req.path,
      method: req.method,
      hasSession: !!req.session,
      isAuthenticated: req.isAuthenticated()
    });
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user?.isAdmin) {
    console.log('[Admin Middleware] Non-admin access attempt:', {
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}