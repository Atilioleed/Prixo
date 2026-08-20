import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai/generateWithFallback";
import { hasAnyProviderConfigured } from "@/lib/ai/providers";
import { buildPlanSystemPrompt } from "@/lib/planSystemPrompt";
import { sendSlackAlert } from "@/lib/slack";
import type { TutorProfile } from "@/context/TutorProfileContext";

// Plan generation (with fallback across providers) can take well over
// Vercel's default 10s function timeout — this raises the cap explicitly.
export const maxDuration = 60;

interface PlanRequestBody {
  context: string;
  deadline: string;
  profile: TutorProfile;
}

interface PlanResult {
  shortTerm: string[];
  longTerm: string[];
  milestones: { title: string; when: string }[];
  scenarios: string[];
}

function extractJson(text: string): PlanResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (
      Array.isArray(parsed.shortTerm) &&
      Array.isArray(parsed.longTerm) &&
      Array.isArray(parsed.milestones) &&
      Array.isArray(parsed.scenarios)
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function POST(req: NextRequest) {
  if (!hasAnyProviderConfigured()) {
    return NextResponse.json(
      {
        error:
          "No hay ningún proveedor de IA configurado en el servidor. Agrega al menos una API key en .env.local (ver .env.local.example) y reinicia `npm run dev`.",
      },
      { status: 500 }
    );
  }

  let body: PlanRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!body.context?.trim() || !body.profile) {
    return NextResponse.json({ error: "Cuéntame tu objetivo antes de generar el plan." }, { status: 400 });
  }

  const userPrompt = body.deadline
    ? `Situación: ${body.context}\nFecha límite: ${body.deadline}`
    : `Situación: ${body.context}\nSin fecha límite específica.`;

  try {
    const { text: raw } = await generateWithFallback({
      system: buildPlanSystemPrompt(body.profile),
      messages: [{ role: "user", content: userPrompt }],
      maxOutputTokens: 1000,
    });

    const parsed = extractJson(raw);

    if (!parsed) {
      return NextResponse.json({ error: "No pude generar el plan, intenta de nuevo." }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    void sendSlackAlert(`🔴 Todos los proveedores de IA fallaron en /api/plan — ${message}`);
    return NextResponse.json({ error: `Error al contactar la IA: ${message}` }, { status: 502 });
  }
}
