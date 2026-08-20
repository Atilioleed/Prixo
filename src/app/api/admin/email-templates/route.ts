import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { emailTemplates } from "@/db/schema";
import { DEFAULT_TEMPLATES, TEMPLATE_META, type TemplateKey } from "@/lib/emailTemplates";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const overrides = dbConfigured() ? await getDb().select().from(emailTemplates) : [];
  const overrideByKey = new Map(overrides.map((o) => [o.key, o]));

  const templates = (Object.keys(DEFAULT_TEMPLATES) as TemplateKey[]).map((key) => {
    const override = overrideByKey.get(key);
    const fields = override
      ? { subject: override.subject, title: override.title, bodyHtml: override.bodyHtml, ctaLabel: override.ctaLabel ?? "", ctaPath: override.ctaPath ?? "" }
      : DEFAULT_TEMPLATES[key];
    return {
      key,
      ...TEMPLATE_META[key],
      fields,
      isCustomized: !!override,
    };
  });

  return NextResponse.json({ templates, dbConfigured: dbConfigured() });
}
