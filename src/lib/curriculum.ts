export interface Stage {
  level: string;
  title: string;
  description: string;
  test: string;
}

export const STAGES: Stage[] = [
  { level: "A1", title: "Primeros pasos", description: "Vocabulario y frases básicas del día a día.", test: "Diagnóstico inicial" },
  { level: "A2", title: "Conversación cotidiana", description: "Pasado simple, rutinas, compras, viajes cortos.", test: "Cierre de unidad — Pasado simple" },
  { level: "B1", title: "Situaciones reales", description: "Negociación básica, entrevistas, presente perfecto.", test: "Simulacro de entrevista" },
  { level: "B2", title: "Inglés de negocios", description: "Reuniones, propuestas, negociación avanzada.", test: "Evaluación de negociación" },
  { level: "C1", title: "Fluidez profesional", description: "Matices, persuasión, pitch a inversionistas.", test: "Evaluación de fluidez" },
];
