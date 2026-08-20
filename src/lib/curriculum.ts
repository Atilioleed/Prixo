import type { AgeRange } from "@/lib/tutorProfile";

export interface Stage {
  level: string;
  title: string;
  description: string;
  /** Concrete topics the tutor works through during this stage, age-flavored. */
  topics: string[];
  /**
   * Every stage has exactly 3 evaluations: two lightweight checkpoints along
   * the way, and one final exam that's the actual gate to the next stage.
   */
  tests: { title: string; kind: "checkpoint" | "final" }[];
}

// 5 stages (A1 -> C1), the same proficiency backbone for every learner.
// What changes per age range is the topic flavor and the test titles below —
// see CURRICULUM. This array is the adult/default flavor, kept as the
// fallback for any profile whose ageRange isn't set yet.
const ADULT_STAGES: Stage[] = [
  {
    level: "A1",
    title: "Primeros pasos",
    description: "Vocabulario y frases básicas del día a día.",
    topics: ["Presentarte y datos personales", "Números, fechas y horarios", "Pedir y dar direcciones", "El clima y rutinas diarias"],
    tests: [
      { title: "Chequeo — vocabulario básico", kind: "checkpoint" },
      { title: "Chequeo — presentarte en 1 minuto", kind: "checkpoint" },
      { title: "Diagnóstico inicial", kind: "final" },
    ],
  },
  {
    level: "A2",
    title: "Conversación cotidiana",
    description: "Pasado simple, rutinas, compras, viajes cortos.",
    topics: ["Pasado simple (verbos regulares e irregulares)", "En el supermercado y restaurantes", "Transporte y viajes cortos", "Contar una anécdota simple"],
    tests: [
      { title: "Chequeo — pasado simple", kind: "checkpoint" },
      { title: "Chequeo — diálogo de compras", kind: "checkpoint" },
      { title: "Cierre de unidad — Pasado simple", kind: "final" },
    ],
  },
  {
    level: "B1",
    title: "Situaciones reales",
    description: "Negociación básica, entrevistas, presente perfecto.",
    topics: ["Presente perfecto", "Entrevistas y preguntas frecuentes", "Negociación básica de precios", "Dar opiniones y justificarlas"],
    tests: [
      { title: "Chequeo — presente perfecto", kind: "checkpoint" },
      { title: "Chequeo — roleplay de entrevista", kind: "checkpoint" },
      { title: "Simulacro de entrevista", kind: "final" },
    ],
  },
  {
    level: "B2",
    title: "Inglés de negocios",
    description: "Reuniones, propuestas, negociación avanzada.",
    topics: ["Reuniones y presentaciones", "Negociación avanzada", "Escribir correos formales", "Matices y expresiones idiomáticas comunes"],
    tests: [
      { title: "Chequeo — vocabulario de reuniones", kind: "checkpoint" },
      { title: "Chequeo — roleplay de negociación", kind: "checkpoint" },
      { title: "Evaluación de negociación", kind: "final" },
    ],
  },
  {
    level: "C1",
    title: "Fluidez profesional",
    description: "Matices, persuasión, pitch a inversionistas.",
    topics: ["Persuasión y storytelling", "Pitch a inversionistas", "Debatir y defender una postura", "Humor y registro informal vs. formal"],
    tests: [
      { title: "Chequeo — pitch de 2 minutos", kind: "checkpoint" },
      { title: "Chequeo — debate estructurado", kind: "checkpoint" },
      { title: "Evaluación de fluidez", kind: "final" },
    ],
  },
];

const CHILD_STAGES: Stage[] = [
  {
    level: "A1",
    title: "Mis primeras palabras",
    description: "Familia, colores, números y animales.",
    topics: ["Mi familia", "Colores y números del 1 al 20", "Animales y sus sonidos", "Saludos y cortesía"],
    tests: [
      { title: "Juego — nombra los colores", kind: "checkpoint" },
      { title: "Juego — cuenta hasta 20", kind: "checkpoint" },
      { title: "Diagnóstico inicial", kind: "final" },
    ],
  },
  {
    level: "A2",
    title: "Mi día a día",
    description: "Rutinas, la escuela, juguetes y comida.",
    topics: ["Mi rutina diaria", "En la escuela", "Comidas y sabores favoritos", "Juguetes y juegos"],
    tests: [
      { title: "Juego — mi rutina en dibujos", kind: "checkpoint" },
      { title: "Juego — memoria de vocabulario", kind: "checkpoint" },
      { title: "Cierre de unidad — Mi día a día", kind: "final" },
    ],
  },
  {
    level: "B1",
    title: "Cuentos y aventuras",
    description: "Contar historias cortas, hobbies, mascotas.",
    topics: ["Contar un cuento corto", "Hobbies y deportes", "Mascotas y cuidados", "Preguntar y responder sobre gustos"],
    tests: [
      { title: "Chequeo — inventa un final", kind: "checkpoint" },
      { title: "Chequeo — describe tu hobby", kind: "checkpoint" },
      { title: "Simulacro — cuenta tu aventura", kind: "final" },
    ],
  },
  {
    level: "B2",
    title: "Explorador curioso",
    description: "Ciencia simple, geografía, dar opiniones.",
    topics: ["Datos curiosos de animales y espacio", "Países y banderas", "Dar tu opinión ('I think...')", "Planificar un viaje imaginario"],
    tests: [
      { title: "Chequeo — dato curioso favorito", kind: "checkpoint" },
      { title: "Chequeo — planea un viaje", kind: "checkpoint" },
      { title: "Evaluación — mi opinión", kind: "final" },
    ],
  },
  {
    level: "C1",
    title: "Pequeño presentador",
    description: "Presentaciones cortas y debates sencillos.",
    topics: ["Presentar un proyecto de la escuela", "Debate sencillo (a favor / en contra)", "Contar chistes y humor simple", "Entrevistar a un amigo imaginario"],
    tests: [
      { title: "Chequeo — presenta tu proyecto", kind: "checkpoint" },
      { title: "Chequeo — mini debate", kind: "checkpoint" },
      { title: "Evaluación de fluidez", kind: "final" },
    ],
  },
];

const TEEN_STAGES: Stage[] = [
  {
    level: "A1",
    title: "Primeros pasos",
    description: "Presentarte, tu escuela, tus gustos.",
    topics: ["Presentarte con tu edad y gustos", "Tu escuela y materias favoritas", "Redes sociales básicas", "Planes para el finde"],
    tests: [
      { title: "Chequeo — preséntate", kind: "checkpoint" },
      { title: "Chequeo — tus materias favoritas", kind: "checkpoint" },
      { title: "Diagnóstico inicial", kind: "final" },
    ],
  },
  {
    level: "A2",
    title: "Mi mundo",
    description: "Rutinas, amistades, salidas, pasado simple.",
    topics: ["Pasado simple — el finde pasado", "Amistades y planes", "Series, música y gustos", "Pedir permiso y dar excusas"],
    tests: [
      { title: "Chequeo — pasado simple", kind: "checkpoint" },
      { title: "Chequeo — cuenta tu finde", kind: "checkpoint" },
      { title: "Cierre de unidad — Mi mundo", kind: "final" },
    ],
  },
  {
    level: "B1",
    title: "Situaciones reales",
    description: "Entrevistas de intercambio, redes, opiniones.",
    topics: ["Entrevista para un intercambio", "Dar tu opinión sobre redes sociales", "Presente perfecto", "Resolver un conflicto con un amigo"],
    tests: [
      { title: "Chequeo — presente perfecto", kind: "checkpoint" },
      { title: "Chequeo — roleplay de entrevista", kind: "checkpoint" },
      { title: "Simulacro de entrevista", kind: "final" },
    ],
  },
  {
    level: "B2",
    title: "Preparándome para el futuro",
    description: "Universidad, primer trabajo, debates.",
    topics: ["Hablar de planes universitarios", "Un primer trabajo o pasantía", "Debatir un tema de actualidad", "Escribir un email formal simple"],
    tests: [
      { title: "Chequeo — planes a futuro", kind: "checkpoint" },
      { title: "Chequeo — mini debate", kind: "checkpoint" },
      { title: "Evaluación de negociación", kind: "final" },
    ],
  },
  {
    level: "C1",
    title: "Fluidez profesional",
    description: "Persuasión, pitch de un proyecto propio.",
    topics: ["Pitch de un proyecto o idea propia", "Persuadir con argumentos", "Humor y modismos comunes", "Entrevista laboral simulada"],
    tests: [
      { title: "Chequeo — pitch de 2 minutos", kind: "checkpoint" },
      { title: "Chequeo — debate estructurado", kind: "checkpoint" },
      { title: "Evaluación de fluidez", kind: "final" },
    ],
  },
];

const SENIOR_STAGES: Stage[] = [
  {
    level: "A1",
    title: "Primeros pasos",
    description: "Presentarte, tu familia, tu día a día.",
    topics: ["Presentarte con calma", "Tu familia y tus nietos", "Números, horarios y fechas", "Frases de cortesía"],
    tests: [
      { title: "Chequeo — vocabulario básico", kind: "checkpoint" },
      { title: "Chequeo — presentarte", kind: "checkpoint" },
      { title: "Diagnóstico inicial", kind: "final" },
    ],
  },
  {
    level: "A2",
    title: "Conversación cotidiana",
    description: "El médico, el supermercado, viajes en familia.",
    topics: ["En el médico o la farmacia", "En el supermercado", "Hablar de tu rutina", "Un viaje en familia"],
    tests: [
      { title: "Chequeo — diálogo del médico", kind: "checkpoint" },
      { title: "Chequeo — diálogo de compras", kind: "checkpoint" },
      { title: "Cierre de unidad — Conversación cotidiana", kind: "final" },
    ],
  },
  {
    level: "B1",
    title: "Situaciones reales",
    description: "Contar recuerdos, videollamadas con nietos, viajes.",
    topics: ["Contar una anécdota o recuerdo", "Videollamada con la familia", "Planificar un viaje", "Presente perfecto"],
    tests: [
      { title: "Chequeo — presente perfecto", kind: "checkpoint" },
      { title: "Chequeo — cuenta un recuerdo", kind: "checkpoint" },
      { title: "Simulacro — planificar un viaje", kind: "final" },
    ],
  },
  {
    level: "B2",
    title: "Conversación con soltura",
    description: "Opiniones, noticias, hobbies con más detalle.",
    topics: ["Comentar una noticia", "Hablar de hobbies en detalle", "Dar tu opinión y justificarla", "Expresiones idiomáticas comunes"],
    tests: [
      { title: "Chequeo — comenta una noticia", kind: "checkpoint" },
      { title: "Chequeo — tu opinión", kind: "checkpoint" },
      { title: "Evaluación de negociación", kind: "final" },
    ],
  },
  {
    level: "C1",
    title: "Fluidez con soltura",
    description: "Debates, contar historias largas, humor.",
    topics: ["Contar una historia larga con detalle", "Debatir con argumentos", "Humor y dobles sentidos comunes", "Dar consejos a otros"],
    tests: [
      { title: "Chequeo — cuenta una historia", kind: "checkpoint" },
      { title: "Chequeo — mini debate", kind: "checkpoint" },
      { title: "Evaluación de fluidez", kind: "final" },
    ],
  },
];

/**
 * The full curriculum: 5 stages x 4 age flavors = 20 pre-built stage
 * definitions, each with 3 evaluations (2 checkpoints + 1 final exam that
 * actually advances the learner). Every client — regardless of level, age
 * range, or goal — has real content to start on immediately; the AI tutor
 * layers the client's specific goal/scenario on top of this base (see
 * buildTutorSystemPrompt), it doesn't replace it.
 */
export const CURRICULUM: Record<AgeRange, Stage[]> = {
  nino: CHILD_STAGES,
  adolescente: TEEN_STAGES,
  adulto: ADULT_STAGES,
  adulto_mayor: SENIOR_STAGES,
};

export function stagesFor(ageRange: AgeRange | undefined | null): Stage[] {
  return CURRICULUM[ageRange ?? "adulto"] ?? ADULT_STAGES;
}

// Kept for any code that still wants a single generic list (e.g. the public
// marketing copy, which doesn't know a specific learner's age range yet).
export const STAGES = ADULT_STAGES;

export const MOTIVATIONAL_MESSAGES: Record<AgeRange, string[]> = {
  nino: [
    "¡Increíble! ¡Superaste la etapa como un campeón! 🎉",
    "¡Wow! Cada vez sabes más — ¡sigue así, crack!",
    "¡Lo lograste! Tu tutor está súper orgulloso de ti.",
    "¡Nivel superado! Estás cada vez más cerca de ser un experto.",
  ],
  adolescente: [
    "¡Etapa superada! Tu esfuerzo se nota — sigue así.",
    "Nivel completado. Cada vez te falta menos para dominarlo.",
    "¡Bien ahí! Ese avance no es casualidad, es constancia.",
    "¡Lo lograste! Un paso más cerca de tu objetivo real.",
  ],
  adulto: [
    "Etapa completada — tu constancia está dando resultados.",
    "¡Felicitaciones! Ese es un avance concreto hacia tu objetivo.",
    "Nivel superado. Cada sesión te acerca más a hablar con soltura.",
    "¡Bien hecho! El esfuerzo de estas semanas se nota.",
  ],
  adulto_mayor: [
    "¡Felicitaciones! Completaste esta etapa con muy buen ritmo.",
    "Excelente avance — cada práctica suma, y se nota.",
    "¡Lo lograste! Sigue a tu propio ritmo, vas muy bien.",
    "Etapa superada — un logro más para celebrar.",
  ],
};

export function randomMotivationalMessage(ageRange: AgeRange | undefined | null): string {
  const pool = MOTIVATIONAL_MESSAGES[ageRange ?? "adulto"] ?? MOTIVATIONAL_MESSAGES.adulto;
  return pool[Math.floor(Math.random() * pool.length)];
}
