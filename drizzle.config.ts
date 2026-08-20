import { existsSync, readFileSync } from "node:fs";
import type { Config } from "drizzle-kit";

// drizzle-kit doesn't load .env.local the way `next dev` does, so read it
// manually here for `npm run db:push` / `db:generate` / `db:studio`.
const envPath = ".env.local";
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.trim().replace(/^["']|["']$/g, "");
  }
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL || process.env.DATABASE_URL || "",
  },
} satisfies Config;
