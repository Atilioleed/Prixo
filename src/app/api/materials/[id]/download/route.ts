import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/db/client";
import { learningMaterials } from "@/db/schema";

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents after NFD decomposition
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Base de datos no configurada." }, { status: 500 });
  }

  const { id } = await params;
  const [material] = await getDb()
    .select()
    .from(learningMaterials)
    .where(eq(learningMaterials.id, id))
    .limit(1);

  if (!material || material.status !== "published") {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  return new NextResponse(material.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(material.title)}.md"`,
    },
  });
}
