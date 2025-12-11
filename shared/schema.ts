import { pgTable, text, serial, integer, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const leadStatusEnum = pgEnum('lead_status', ['NEW', 'CONTACTED', 'TRIAL', 'NEGOTIATION', 'WON', 'LOST']);
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'PAID', 'OVERDUE']);
export const leadSourceEnum = pgEnum('lead_source', ['Instagram', 'Google', 'Indicação']);
export const studentStatusEnum = pgEnum('student_status', ['Active', 'Inactive']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager']);
export const logTypeEnum = pgEnum('log_type', ['Sistema', 'WhatsApp', 'Financeiro', 'Nota']);

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default('manager'),
  unitId: integer("unit_id").references(() => units.id),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  instrument: text("instrument").notNull(),
  source: leadSourceEnum("source").notNull(),
  status: leadStatusEnum("status").notNull().default('NEW'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => units.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  birthDate: text("birth_date").notNull(),
  responsibleName: text("responsible_name"),
  course: text("course").notNull(),
  status: studentStatusEnum("status").notNull().default('Active'),
});

export const timelineLogs = pgTable("timeline_logs", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  date: timestamp("date").defaultNow().notNull(),
  type: logTypeEnum("type").notNull(),
  message: text("message").notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => students.id),
  unitId: integer("unit_id").notNull().references(() => units.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: text("due_date").notNull(),
  status: paymentStatusEnum("status").notNull().default('PENDING'),
  description: text("description").notNull(),
});

export const systemConfig = pgTable("system_config", {
  id: serial("id").primaryKey(),
  whatsappProvider: text("whatsapp_provider").default('gateway'),
  whatsappBaseUrl: text("whatsapp_base_url"),
  whatsappApiKey: text("whatsapp_api_key"),
  whatsappPhoneNumberId: text("whatsapp_phone_number_id"),
  geminiApiKey: text("gemini_api_key"),
  notificationEmail: text("notification_email"),
});

export const unitsRelations = relations(units, ({ many }) => ({
  leads: many(leads),
  students: many(students),
  payments: many(payments),
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  unit: one(units, {
    fields: [users.unitId],
    references: [units.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  unit: one(units, {
    fields: [leads.unitId],
    references: [units.id],
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  unit: one(units, {
    fields: [students.unitId],
    references: [units.id],
  }),
  timeline: many(timelineLogs),
  payments: many(payments),
}));

export const timelineLogsRelations = relations(timelineLogs, ({ one }) => ({
  student: one(students, {
    fields: [timelineLogs.studentId],
    references: [students.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  student: one(students, {
    fields: [payments.studentId],
    references: [students.id],
  }),
  unit: one(units, {
    fields: [payments.unitId],
    references: [units.id],
  }),
}));

export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;
export type TimelineLog = typeof timelineLogs.$inferSelect;
export type InsertTimelineLog = typeof timelineLogs.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type SystemConfig = typeof systemConfig.$inferSelect;
export type InsertSystemConfig = typeof systemConfig.$inferInsert;
