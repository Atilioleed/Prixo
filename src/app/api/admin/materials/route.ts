import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { learningMaterials } from "@/db/schema";

interface CreateBody {
  title: string;
  level: string;
  type: string;
  language: string;
  content: string;
  status?: "draft" | "published";
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ materials: [], dbConfigured: false });

  const rows = await getDb().select().from(learningMaterials).orderBy(desc(learningMaterials.createdAt));
  return NextResponse.json({ materials: rows, dbConfigured: true });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: "Faltan title o content." }, { status: 400 });
  }

  const [row] = await getDb()
    .insert(learningMaterials)
    .values({
      id: crypto.randomUUID(),
      title: body.title.trim(),
      level: body.level || "A1",
      type: body.type || "Vocabulario",
      language: body.language || "Inglés",
      content: body.content,
      status: body.status === "published" ? "published" : "draft",
    })
    .returning();

  return NextResponse.json({ material: row });
}
