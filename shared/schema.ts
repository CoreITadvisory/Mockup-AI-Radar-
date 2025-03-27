import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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

// Risk level enum
export const RiskLevel = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export type RiskLevelType = (typeof RiskLevel)[keyof typeof RiskLevel];

// Source enum
export const Source = {
  GITHUB: "github",
  PRODUCT_HUNT: "producthunt",
  TWITTER: "twitter",
  REDDIT: "reddit",
} as const;

export type SourceType = (typeof Source)[keyof typeof Source];

// Category enum
export const Category = {
  TEXT: "text",
  IMAGE: "image",
  VOICE: "voice",
  CODING: "coding",
  DATA: "data",
  OTHER: "other",
} as const;

export type CategoryType = (typeof Category)[keyof typeof Category];

// Status enum
export const Status = {
  PENDING: "pending",
  APPROVED: "approved",
  BLOCKED: "blocked",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

export const aiTools = pgTable("ai_tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  category: text("category").notNull(),
  accessType: text("access_type").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url").notNull(),
  websiteUrl: text("website_url"),
  riskLevel: text("risk_level").notNull(),
  status: text("status").notNull().default("pending"),
  securityAssessment: jsonb("security_assessment").notNull(),
  discoveredAt: timestamp("discovered_at").notNull().defaultNow(),
});

export const insertAIToolSchema = createInsertSchema(aiTools).omit({
  id: true,
  discoveredAt: true,
});

export type InsertAITool = z.infer<typeof insertAIToolSchema>;
export type AITool = typeof aiTools.$inferSelect;

export const securityRisks = pgTable("security_risks", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").notNull(),
  description: text("description").notNull(),
});

export const insertSecurityRiskSchema = createInsertSchema(securityRisks).omit({
  id: true,
});

export type InsertSecurityRisk = z.infer<typeof insertSecurityRiskSchema>;
export type SecurityRisk = typeof securityRisks.$inferSelect;
