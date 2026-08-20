import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { knowledgeSources } from "@/db/schema";

interface UpdateBody {
  title?: string;
  url?: string;
  category?: string;
  notes?: string;
  active?: boolean;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { id } = await params;
  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const [row] = await getDb()
    .update(knowledgeSources)
    .set(body)
    .where(eq(knowledgeSources.id, id))
    .returning();

  if (!row) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ source: row });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { id } = await params;
  await getDb().delete(knowledgeSources).where(eq(knowledgeSources.id, id));
  return NextResponse.json({ ok: true });
}
