import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { pdf } from "@react-pdf/renderer";
import { getDb, dbConfigured } from "@/db/client";
import { learningMaterials } from "@/db/schema";
import { parseMaterialContent } from "@/lib/materialContent";
import { MaterialPdfDocument } from "@/lib/materialPdf";

// @react-pdf/renderer needs Node APIs (streams) — must not run on the Edge runtime.
export const runtime = "nodejs";

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

  const structured = parseMaterialContent(material.content);

  if (!structured) {
    // Legacy freeform-markdown material — keep serving it as-is.
    return new NextResponse(material.content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slugify(material.title)}.md"`,
      },
    });
  }

  // Plain function call, not JSX — this file is .ts, not .tsx, and route
  // handlers must stay .ts. MaterialPdfDocument is a hook-free function
  // component, so calling it directly returns the same element JSX would.
  const buffer = await pdf(
    MaterialPdfDocument({
      title: material.title,
      level: material.level,
      type: material.type,
      language: material.language,
      content: structured,
    })
  ).toBuffer();

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slugify(material.title)}.pdf"`,
    },
  });
}
