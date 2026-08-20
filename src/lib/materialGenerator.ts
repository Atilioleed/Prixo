import { generateWithFallback } from "@/lib/ai/generateWithFallback";
import { isStructuredContent, type MaterialContent } from "@/lib/materialContent";

const LEVEL_DESCRIPTION: Record<string, string> = {
  A1: "principiante absoluto — vocabulario y frases cortas del día a día",
  A2: "básico — oraciones simples, pasado simple, situaciones cotidianas",
  B1: "intermedio — puede mantener una conversación sobre temas conocidos",
  B2: "intermedio alto — fluidez en trabajo, negociación, matices",
  C1: "avanzado — persuasión, debate, expresiones idiomáticas, sutileza",
};

function buildGeneratorPrompt(opts: { language: string; level: string; type: string; topic: string }): string {
  const levelDesc = LEVEL_DESCRIPTION[opts.level] ?? opts.level;
  return `Eres un experto diseñador de material educativo bilingüe para una app de aprendizaje de idiomas llamada Prixo. Los alumnos son hispanohablantes que aprenden ${opts.language}.

Crea el contenido de un documento de estudio sobre: "${opts.topic}".
Nivel: ${opts.level} (${levelDesc}). Tipo de documento: ${opts.type}.

Reglas de calidad:
- El ${opts.language} debe calibrarse exactamente al nivel ${opts.level}, ni más fácil ni más difícil.
- Cada palabra o frase en ${opts.language} SIEMPRE va acompañada de su significado en español y un ejemplo real de uso, con su traducción. Nunca dejes texto en ${opts.language} sin explicar.
- Todo el texto explicativo va en español neutro latinoamericano (tuteo: "tú", nunca voseo argentino).
- Sé preciso y útil, no relleno genérico — como lo escribiría un profesor experto, no una lista al azar.
- Incluye entre 8 y 12 palabras/frases de vocabulario si el tema lo amerita, y entre 5 y 8 frases útiles si aplica.
- Si el tema es gramatical, usa "note" para explicar la regla con claridad y ejemplos, no solo un titular.

Responde SIEMPRE con un único objeto JSON plano, sin texto fuera de él y sin bloques de código (nunca uses \`\`\`), con esta forma exacta:
{
  "intro": "1-3 frases en español explicando qué cubre este documento y por qué sirve",
  "sections": [
    {
      "heading": "string en español",
      "vocab": [{"term": "palabra en ${opts.language}", "pronunciation": "guía fonética simple en mayúsculas con guiones", "meaning": "significado en español", "example": "oración de ejemplo en ${opts.language}", "exampleEs": "traducción al español"}]
    },
    {
      "heading": "Frases útiles",
      "phrases": [{"phrase": "frase en ${opts.language}", "meaning": "traducción/explicación en español"}]
    },
    {
      "heading": "string en español (ej. 'Tip cultural' o 'Regla gramatical')",
      "note": "explicación en español, 2-5 frases"
    }
  ],
  "practice": "1-2 frases en español proponiendo un ejercicio de práctica con el tutor de IA"
}

Incluye solo las claves "vocab", "phrases" o "note" que correspondan a cada sección — no fuerces las tres en cada una. Usa 2 a 4 secciones en total.`;
}

export interface GeneratedMaterial {
  content: MaterialContent;
  provider: string;
}

export async function generateMaterialContent(opts: {
  language: string;
  level: string;
  type: string;
  topic: string;
}): Promise<GeneratedMaterial> {
  const { text, provider } = await generateWithFallback({
    system: buildGeneratorPrompt(opts),
    messages: [{ role: "user", content: `Genera el documento para: "${opts.topic}".` }],
    maxOutputTokens: 2200,
  });

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("La IA no devolvió un JSON válido.");

  const parsed = JSON.parse(match[0]);
  if (!isStructuredContent(parsed)) throw new Error("El JSON generado no tiene la forma esperada.");

  return { content: parsed, provider };
}
