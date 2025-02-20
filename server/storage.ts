import { users, magicLinks, type User, type InsertUser, type MagicLink } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { randomBytes } from "crypto";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMagicLink(userId: number): Promise<MagicLink>;
  validateMagicLink(token: string): Promise<User | undefined>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, isAdmin: false })
      .returning();
    return user;
  }

  async createMagicLink(userId: number): Promise<MagicLink> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const [magicLink] = await db
      .insert(magicLinks)
      .values({
        token,
        userId,
        expiresAt,
        used: false,
      })
      .returning();

    return magicLink;
  }

  async validateMagicLink(token: string): Promise<User | undefined> {
    const now = new Date();

    // Find valid magic link
    const [magicLink] = await db
      .select()
      .from(magicLinks)
      .where(
        and(
          eq(magicLinks.token, token),
          eq(magicLinks.used, false),
          gt(magicLinks.expiresAt, now)
        )
      );

    if (!magicLink) {
      return undefined;
    }

    // Mark token as used
    await db
      .update(magicLinks)
      .set({ used: true })
      .where(eq(magicLinks.id, magicLink.id));

    // Get associated user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, magicLink.userId));

    return user;
  }
}

export const storage = new DatabaseStorage();