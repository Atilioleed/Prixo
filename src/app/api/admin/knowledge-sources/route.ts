import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { requireAdminSession } from "@/lib/adminAuth";
import { getDb, dbConfigured } from "@/db/client";
import { knowledgeSources } from "@/db/schema";

interface CreateBody {
  title: string;
  url: string;
  category?: string;
  notes?: string;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ sources: [], dbConfigured: false });

  const rows = await getDb().select().from(knowledgeSources).orderBy(desc(knowledgeSources.createdAt));
  return NextResponse.json({ sources: rows, dbConfigured: true });
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

  if (!body.title?.trim() || !body.url?.trim()) {
    return NextResponse.json({ error: "Faltan title o url." }, { status: 400 });
  }

  const [row] = await getDb()
    .insert(knowledgeSources)
    .values({
      id: crypto.randomUUID(),
      title: body.title.trim(),
      url: body.url.trim(),
      category: body.category?.trim() || "General",
      notes: body.notes?.trim() || "",
    })
    .returning();

  return NextResponse.json({ source: row });
}
