import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Vercel Postgres (Neon-backed) injects POSTGRES_URL automatically once you
// create the database from the Storage tab. DATABASE_URL is the fallback for
// any other Postgres provider (Neon direct, Supabase, etc).
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

export function dbConfigured(): boolean {
  return !!connectionString;
}

let client: ReturnType<typeof postgres> | null = null;

function getClient() {
  if (!connectionString) {
    throw new Error(
      "No hay base de datos configurada — falta POSTGRES_URL o DATABASE_URL en .env.local."
    );
  }
  if (!client) {
    client = postgres(connectionString, { max: 1 });
  }
  return client;
}

// Lazy singleton: only opens a connection the first time a query actually
// runs, so pages that never touch the DB (most of the app, pre-migration)
// don't fail at import time when no database is configured yet.
export function getDb() {
  return drizzle(getClient(), { schema });
}
