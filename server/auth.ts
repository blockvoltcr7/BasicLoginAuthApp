import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { sendMagicLinkEmail, sendPasswordResetEmail } from "./email";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !user.password || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Existing routes
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const user = await storage.createUser({
        ...req.body,
        password: req.body.password ? await hashPassword(req.body.password) : null,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  // New magic link routes
  app.post("/api/magic-link", async (req, res) => {
    const { email } = req.body;

    try {
      let user = await storage.getUserByEmail(email);

      // Create user if they don't exist
      if (!user) {
        const username = email.split('@')[0];
        user = await storage.createUser({
          email,
          username,
        });
      }

      const magicLink = await storage.createMagicLink(user.id);
      const emailSent = await sendMagicLinkEmail(
        email,
        magicLink.token,
        `${req.protocol}://${req.get('host')}`
      );

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send magic link email" });
      }

      res.json({ message: "Magic link sent to your email" });
    } catch (error) {
      console.error("Magic link error:", error);
      res.status(500).json({ message: "Failed to create magic link" });
    }
  });

  app.get("/api/verify", async (req, res, next) => {
    const { token, type } = req.query;

    console.log("[/api/verify] Received verification request:", { token, type });

    if (!token || typeof token !== "string") {
      console.log("[/api/verify] Invalid token provided");
      return res.status(400).json({ message: "Invalid token" });
    }

    try {
      // Handle password reset token verification
      if (type === "reset-password") {
        console.log("[/api/verify] Verifying password reset token");
        const resetToken = await storage.validatePasswordResetToken(token);

        if (!resetToken) {
          console.log("[/api/verify] Invalid or expired reset token");
          return res.status(400).json({ message: "Invalid or expired token" });
        }

        console.log("[/api/verify] Reset token valid, sending success response");
        return res.json({ message: "Token valid", token });
      }

      // Handle magic link verification (existing logic)
      console.log("[/api/verify] Verifying magic link token");
      const user = await storage.validateMagicLink(token);

      if (!user) {
        console.log("[/api/verify] Invalid or expired magic link token");
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      console.log("[/api/verify] Magic link valid, logging in user:", user.id);
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    } catch (error) {
      console.error("[/api/verify] Verification error:", error);
      res.status(500).json({ message: "Failed to verify token" });
    }
  });

  // Add password reset routes
  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
      // Always return success to prevent email enumeration
      const user = await storage.getUserByEmail(email);

      if (user) {
        const token = await storage.createPasswordResetToken(user.id);
        await sendPasswordResetEmail(
          email,
          token.token,
          `${req.protocol}://${req.get('host')}`
        );
      }

      res.json({ message: "If an account exists with that email, a password reset link has been sent." });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    const { token, password } = req.body;

    try {
      const resetToken = await storage.validatePasswordResetToken(token);

      if (!resetToken) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      const hashedPassword = await hashPassword(password);
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      await storage.markPasswordResetTokenAsUsed(token);

      res.json({ message: "Password successfully reset" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}