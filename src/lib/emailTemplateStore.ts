import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/db/client";
import { emailTemplates } from "@/db/schema";
import { DEFAULT_TEMPLATES, renderTemplate, type TemplateKey, type TemplateFields } from "@/lib/emailTemplates";

/** The admin-edited version if one exists in the database, else the built-in default. */
export async function getTemplateFields(key: TemplateKey): Promise<TemplateFields> {
  if (dbConfigured()) {
    try {
      const [row] = await getDb().select().from(emailTemplates).where(eq(emailTemplates.key, key)).limit(1);
      if (row) {
        return {
          subject: row.subject,
          title: row.title,
          bodyHtml: row.bodyHtml,
          ctaLabel: row.ctaLabel ?? "",
          ctaPath: row.ctaPath ?? "",
        };
      }
    } catch {
      // fall through to the hardcoded default if the query fails for any reason
    }
  }
  return DEFAULT_TEMPLATES[key];
}

/** Fetches the current template (DB override or default) and renders it with real values. */
export async function buildEmail(key: TemplateKey, vars: Record<string, string>, siteUrl: string) {
  const fields = await getTemplateFields(key);
  return renderTemplate(fields, vars, siteUrl);
}
