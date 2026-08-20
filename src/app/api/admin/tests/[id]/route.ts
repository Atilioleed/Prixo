import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { tests } from "@/db/schema";
import type { TestQuestion } from "@/lib/tests";

interface UpdateBody {
  title?: string;
  language?: string;
  ageRange?: string;
  level?: string;
  kind?: "checkpoint" | "final";
  passingScore?: number;
  questions?: TestQuestion[];
  status?: "draft" | "published";
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

  const { questions, ...rest } = body;
  const [row] = await getDb()
    .update(tests)
    .set({
      ...rest,
      ...(questions ? { questions: JSON.stringify(questions) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(tests.id, id))
    .returning();

  if (!row) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  return NextResponse.json({ test: { ...row, questions: JSON.parse(row.questions) } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { id } = await params;
  await getDb().delete(tests).where(eq(tests.id, id));
  return NextResponse.json({ ok: true });
}
