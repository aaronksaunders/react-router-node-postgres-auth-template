import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Represents the guest book table schema.
 * 
 * @module schema
 * @table guestBook
 * @property {number} id - The unique identifier for each guest book entry.
 * @property {string} name - The name of the guest.
 * @property {string} email - The email of the guest, must be unique.
 */
export const guestBook = pgTable("guestBook", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

/**
 * Represents the users table schema.
 * 
 * @table users
 * @property {number} id - The unique identifier for each user.
 * @property {string} email - The email of the user, must be unique.
 * @property {string} passwordHash - The hashed password of the user.
 * @property {string} username - The username of the user, must be unique.
 * @property {Date} createdAt - The timestamp when the user was created.
 * @property {Date} updatedAt - The timestamp when the user was last updated.
 */
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});