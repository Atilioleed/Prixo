import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb, dbConfigured } from "@/db/client";
import { tests } from "@/db/schema";
import { scoreAnswers, type TestQuestion } from "@/lib/tests";

interface SubmitBody {
  answers: Record<string, number>; // questionId -> chosen option index
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { id } = await params;
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const [row] = await getDb().select().from(tests).where(eq(tests.id, id)).limit(1);
  if (!row || row.status !== "published") {
    return NextResponse.json({ error: "Prueba no encontrada." }, { status: 404 });
  }

  let questions: TestQuestion[] = [];
  try {
    questions = JSON.parse(row.questions);
  } catch {
    questions = [];
  }

  const { correctCount, total, score } = scoreAnswers(questions, body.answers ?? {});
  const passed = score >= row.passingScore;

  return NextResponse.json({ correctCount, total, score, passed, passingScore: row.passingScore });
}
