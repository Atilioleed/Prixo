import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Phase 1 of the database migration: the tables that unlock real admin CRUD
// (materials, email templates, reference sources) without touching the
// student-facing localStorage contexts yet (profile/plan/sessions/schedule —
// those come in phase 2, once this foundation is proven in production).
// ---------------------------------------------------------------------------

export const learningMaterials = pgTable("learning_materials", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  level: text("level").notNull(), // A1..C1
  type: text("type").notNull(), // Vocabulario | Gramática | Lección
  language: text("language").notNull().default("Inglés"),
  content: text("content").notNull(), // markdown body
  status: text("status").notNull().default("draft"), // "draft" | "published"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailTemplates = pgTable("email_templates", {
  id: text("id").primaryKey(),
  // Matches the template keys in src/lib/emailTemplates.ts — "clase-agendada",
  // "recordatorio", "bienvenida", "clave-actualizada".
  key: text("key").notNull().unique(),
  subject: text("subject").notNull(),
  title: text("title").notNull(), // the <h1> inside the email
  bodyHtml: text("body_html").notNull(), // the inner paragraph HTML, pre-shell
  ctaLabel: text("cta_label"),
  ctaPath: text("cta_path"), // relative path, e.g. "/app" — combined with siteUrl at send time
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const knowledgeSources = pgTable("knowledge_sources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull().default("General"),
  notes: text("notes").notNull().default(""),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Per-student Google Calendar connection — a separate OAuth grant from
// login (see src/lib/googleCalendar.ts and src/app/api/connectors/
// google-calendar/*), so a student can log in with plain email and still
// connect their calendar independently. Keyed by email, matching how
// session.user.email identifies the current user everywhere else in the
// app (there is no separate users table).
export const googleCalendarTokens = pgTable("google_calendar_tokens", {
  email: text("email").primaryKey(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
