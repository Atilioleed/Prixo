import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { learningMaterials } from "@/db/schema";
import { generateMaterialContent } from "@/lib/materialGenerator";

// Batch generation loops server-side (one AI call per topic) inside a
// single request — Vercel Hobby caps a function at a hard 60s regardless of
// maxDuration. Each topic takes ~10-20s, so the batch size is kept small:
// a request killed mid-batch loses only its still-in-flight topic (earlier
// ones in the loop already committed to the DB before the cutoff).
export const maxDuration = 60;
const MAX_TOPICS_PER_BATCH = 3;

interface GenerateBody {
  topics: string[];
  language: string;
  level: string;
  type: string;
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  let body: GenerateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const topics = (body.topics ?? []).map((t) => t.trim()).filter(Boolean).slice(0, MAX_TOPICS_PER_BATCH);
  if (topics.length === 0 || !body.language || !body.level || !body.type) {
    return NextResponse.json({ error: "Faltan topics, language, level o type." }, { status: 400 });
  }

  const created: { topic: string; id: string }[] = [];
  const failed: { topic: string; error: string }[] = [];

  for (const topic of topics) {
    try {
      const { content } = await generateMaterialContent({
        language: body.language,
        level: body.level,
        type: body.type,
        topic,
      });

      const [row] = await getDb()
        .insert(learningMaterials)
        .values({
          id: crypto.randomUUID(),
          title: topic,
          level: body.level,
          type: body.type,
          language: body.language,
          content: JSON.stringify(content),
          status: "draft", // always draft — a human reviews before it reaches students
        })
        .returning();

      created.push({ topic, id: row.id });
    } catch (err) {
      failed.push({ topic, error: err instanceof Error ? err.message : "Error desconocido" });
    }
  }

  return NextResponse.json({ created, failed });
}
