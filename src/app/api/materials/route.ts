import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, dbConfigured } from "@/db/client";
import { learningMaterials } from "@/db/schema";

export async function GET() {
  if (!dbConfigured()) {
    return NextResponse.json({ materials: [], dbConfigured: false });
  }

  try {
    const rows = await getDb()
      .select()
      .from(learningMaterials)
      .where(eq(learningMaterials.status, "published"));
    return NextResponse.json({ materials: rows, dbConfigured: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
