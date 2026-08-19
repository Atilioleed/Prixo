import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai/generateWithFallback";
import { hasAnyProviderConfigured } from "@/lib/ai/providers";
import { buildTutorSystemPrompt, buildReviewSystemPrompt } from "@/lib/tutorSystemPrompt";
import type { TutorProfile } from "@/context/TutorProfileContext";
import type { LearningPlan } from "@/context/PlanContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
  profile: TutorProfile;
  mode?: "practice" | "review";
  plan?: LearningPlan | null;
}

interface TutorReply {
  reply: string;
  correction: { wrong: string; right: string } | null;
}

function extractJson(text: string): TutorReply | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (typeof parsed.reply === "string") {
      return {
        reply: parsed.reply,
        correction:
          parsed.correction &&
          typeof parsed.correction.wrong === "string" &&
          typeof parsed.correction.right === "string"
            ? parsed.correction
            : null,
      };
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

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || !body.profile) {
    return NextResponse.json({ error: "Faltan messages o profile." }, { status: 400 });
  }

  try {
    const system =
      body.mode === "review"
        ? buildReviewSystemPrompt(body.profile, body.plan ?? null)
        : buildTutorSystemPrompt(body.profile);

    const { text: raw } = await generateWithFallback({
      system,
      messages: body.messages.map((m) => ({ role: m.role, content: m.content })),
      maxOutputTokens: 400,
    });

    const parsed = extractJson(raw);

    if (!parsed) {
      return NextResponse.json(
        { reply: raw || "No pude generar una respuesta, intenta de nuevo.", correction: null }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Error al contactar la IA: ${message}` }, { status: 502 });
  }
}
