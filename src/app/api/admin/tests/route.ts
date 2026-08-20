import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { tests } from "@/db/schema";
import type { TestFields, TestQuestion } from "@/lib/tests";

function toResponseRow(row: typeof tests.$inferSelect) {
  let questions: TestQuestion[] = [];
  try {
    questions = JSON.parse(row.questions);
  } catch {
    questions = [];
  }
  return { ...row, questions };
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ tests: [], dbConfigured: false });

  const rows = await getDb().select().from(tests).orderBy(desc(tests.createdAt));
  return NextResponse.json({ tests: rows.map(toResponseRow), dbConfigured: true });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  let body: TestFields & { status?: "draft" | "published" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!body.title?.trim() || !body.level?.trim() || !Array.isArray(body.questions) || body.questions.length === 0) {
    return NextResponse.json({ error: "Faltan title, level o questions." }, { status: 400 });
  }

  const questions: TestQuestion[] = body.questions.map((q) => ({
    id: q.id || crypto.randomUUID(),
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correctIndex,
  }));

  const [row] = await getDb()
    .insert(tests)
    .values({
      id: crypto.randomUUID(),
      title: body.title.trim(),
      language: body.language || "Inglés",
      ageRange: body.ageRange || "adulto",
      level: body.level,
      kind: body.kind === "checkpoint" ? "checkpoint" : "final",
      passingScore: Number.isFinite(body.passingScore) ? body.passingScore : 70,
      questions: JSON.stringify(questions),
      status: body.status === "published" ? "published" : "draft",
    })
    .returning();

  return NextResponse.json({ test: toResponseRow(row) });
}
