import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/db/client";
import { tests } from "@/db/schema";
import { toPublicQuestions, type TestQuestion } from "@/lib/tests";

// Public — a student looking up the real exam for their current stage.
// Never returns correctIndex, so answers can't be read from the network tab.
export async function GET(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ test: null });

  const { searchParams } = req.nextUrl;
  const language = searchParams.get("language");
  const ageRange = searchParams.get("ageRange");
  const level = searchParams.get("level");
  const kind = searchParams.get("kind");

  if (!language || !ageRange || !level || !kind) {
    return NextResponse.json({ error: "Faltan language, ageRange, level o kind." }, { status: 400 });
  }

  const [row] = await getDb()
    .select()
    .from(tests)
    .where(
      and(
        eq(tests.language, language),
        eq(tests.ageRange, ageRange),
        eq(tests.level, level),
        eq(tests.kind, kind),
        eq(tests.status, "published")
      )
    )
    .limit(1);

  if (!row) return NextResponse.json({ test: null });

  let questions: TestQuestion[] = [];
  try {
    questions = JSON.parse(row.questions);
  } catch {
    questions = [];
  }

  return NextResponse.json({
    test: {
      id: row.id,
      title: row.title,
      passingScore: row.passingScore,
      questions: toPublicQuestions(questions),
    },
  });
}
