import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Match-related schemas
export const matchSchema = z.object({
  id: z.number(),
  homeTeam: z.object({
    id: z.number(),
    name: z.string(),
    shortName: z.string(),
    tla: z.string(),
    crest: z.string().optional(),
  }),
  awayTeam: z.object({
    id: z.number(),
    name: z.string(),
    shortName: z.string(),
    tla: z.string(),
    crest: z.string().optional(),
  }),
  utcDate: z.string(),
  status: z.string(),
  matchday: z.number().optional(),
  competition: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    type: z.string(),
    emblem: z.string().optional(),
  }),
});

export const competitionSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  type: z.string(),
  emblem: z.string().optional(),
});

export type Match = z.infer<typeof matchSchema>;
export type Competition = z.infer<typeof competitionSchema>;
