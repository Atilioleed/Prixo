import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { emailTemplates } from "@/db/schema";
import { DEFAULT_TEMPLATES, type TemplateKey } from "@/lib/emailTemplates";

interface UpdateBody {
  subject: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaPath?: string;
}

function isValidKey(key: string): key is TemplateKey {
  return key in DEFAULT_TEMPLATES;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { key } = await params;
  if (!isValidKey(key)) {
    return NextResponse.json({ error: "Plantilla desconocida." }, { status: 400 });
  }

  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!body.subject?.trim() || !body.title?.trim() || !body.bodyHtml?.trim()) {
    return NextResponse.json({ error: "Faltan subject, title o bodyHtml." }, { status: 400 });
  }

  const db = getDb();
  const [existing] = await db.select().from(emailTemplates).where(eq(emailTemplates.key, key)).limit(1);

  if (existing) {
    await db
      .update(emailTemplates)
      .set({
        subject: body.subject,
        title: body.title,
        bodyHtml: body.bodyHtml,
        ctaLabel: body.ctaLabel ?? "",
        ctaPath: body.ctaPath ?? "",
        updatedAt: new Date(),
      })
      .where(eq(emailTemplates.key, key));
  } else {
    await db.insert(emailTemplates).values({
      id: crypto.randomUUID(),
      key,
      subject: body.subject,
      title: body.title,
      bodyHtml: body.bodyHtml,
      ctaLabel: body.ctaLabel ?? "",
      ctaPath: body.ctaPath ?? "",
    });
  }

  return NextResponse.json({ ok: true });
}

/** Reverts a template to its built-in default by deleting the stored override. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { key } = await params;
  await getDb().delete(emailTemplates).where(eq(emailTemplates.key, key));
  return NextResponse.json({ ok: true });
}
