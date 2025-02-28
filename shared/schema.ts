import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),  // Make password optional since we'll support magic links
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const magicLinks = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: serial("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: serial("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
  })
  .extend({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
  });

export const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MagicLink = typeof magicLinks.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;