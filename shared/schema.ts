import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

// Client schema
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  documentNumber: text("document_number").notNull().unique(), // CPF/CNPJ
  clientType: text("client_type").notNull(), // PF (individual) or PJ (company)
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  active: boolean("active").notNull().default(true),
  notes: text("notes"),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  documentNumber: true,
  clientType: true,
  phone: true,
  email: true,
  address: true,
  active: true,
  notes: true,
});

// Case statuses enum
export const caseStatusEnum = pgEnum("case_status", [
  "active",
  "closed",
  "archived",
  "on_hold",
]);

// Legal case schema
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseNumber: text("case_number").notNull().unique(), // CNJ number format
  clientId: integer("client_id").notNull(),
  court: text("court"), // Court name
  jurisdiction: text("jurisdiction"), // Jurisdiction/division
  caseType: text("case_type").notNull(), // Type of legal case
  status: text("status").notNull().default("active"),
  filingDate: timestamp("filing_date").notNull(),
  caseValue: text("case_value"), // Value of the case
  description: text("description"),
  notes: text("notes"),
});

export const insertCaseSchema = createInsertSchema(cases).pick({
  caseNumber: true,
  clientId: true,
  court: true,
  jurisdiction: true,
  caseType: true,
  status: true,
  filingDate: true,
  caseValue: true,
  description: true,
  notes: true,
});

// Case update schema for timeline
export const caseUpdates = pgTable("case_updates", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  updateType: text("update_type").notNull(), // Publication, Petition, Hearing, etc.
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  recordedBy: text("recorded_by").notNull(),
  isImportant: boolean("is_important").default(false),
});

export const insertCaseUpdateSchema = createInsertSchema(caseUpdates).pick({
  caseId: true,
  updateType: true,
  title: true,
  description: true,
  date: true,
  recordedBy: true,
  isImportant: true,
});

// Deadline status enum
export const deadlineStatusEnum = pgEnum("deadline_status", [
  "pending",
  "completed",
  "overdue",
]);

// Deadlines schema
export const deadlines = pgTable("deadlines", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id"),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  priority: text("priority").default("medium"), // low, medium, high
  isWorkingDays: boolean("is_working_days").default(true),
  assignedTo: text("assigned_to"),
});

export const insertDeadlineSchema = createInsertSchema(deadlines).pick({
  caseId: true,
  title: true,
  description: true,
  dueDate: true,
  status: true,
  priority: true,
  isWorkingDays: true,
  assignedTo: true,
});

// Legal documents schema
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id"),
  title: text("title").notNull(),
  documentType: text("document_type").notNull(), // Petition, Appeal, Motion, etc.
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").default("draft"), // draft, finalized, filed
  createdBy: text("created_by").notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  caseId: true,
  title: true,
  documentType: true,
  content: true,
  createdBy: true,
  status: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type CaseUpdate = typeof caseUpdates.$inferSelect;
export type InsertCaseUpdate = z.infer<typeof insertCaseUpdateSchema>;

export type Deadline = typeof deadlines.$inferSelect;
export type InsertDeadline = z.infer<typeof insertDeadlineSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
