// Plain data/types + pure helpers for the tutor profile — deliberately NOT
// "use client". src/context/TutorProfileContext.tsx re-exports all of this
// for client components, but server code (API routes, system prompts) must
// import from here directly: a "use client" file turns every one of its
// exports into a client reference, so a server-side `import { getStageIndex }
// from "@/context/TutorProfileContext"` crashes at runtime ("Attempted to
// call a client function from the server") even though the function itself
// is pure and has no browser dependency.

export type WhoKey = "nino" | "joven" | "viajero" | "profesional" | "negociador";
export type AgeRange = "nino" | "adolescente" | "adulto" | "adulto_mayor";
export type SexOption = "femenino" | "masculino" | "prefiero_no_decir";
export type LevelKey = "principiante" | "basico" | "intermedio" | "avanzado" | "fluido";

export interface TutorProfile {
  displayName: string;
  targetLanguage: string;
  nativeLanguage: string;
  who: WhoKey;
  ageRange: AgeRange;
  sex: SexOption;
  currentLevel: LevelKey;
  placementScore: number | null;
  planGoal: string;
  avatarName: string;
  accent: string;
  formalCercano: number; // 0 = formal, 100 = cercano
  pacienteExigente: number; // 0 = paciente, 100 = exigente
  goal: string;
  scenario: string;
  /**
   * Curriculum progress (index into the current stages array), keyed by
   * target language — so switching from German to English to prep a
   * business deal doesn't wipe out German progress; each language keeps
   * its own place and picks back up if the learner returns to it.
   */
  progressByLanguage: Record<string, number>;
  onboarded: boolean;
}

export const DEFAULT_PROFILE: TutorProfile = {
  displayName: "",
  targetLanguage: "Inglés",
  nativeLanguage: "Español",
  who: "nino",
  ageRange: "adulto",
  sex: "prefiero_no_decir",
  currentLevel: "basico",
  placementScore: null,
  planGoal: "general",
  avatarName: "Max",
  accent: "Americano",
  formalCercano: 30,
  pacienteExigente: 70,
  goal: "Reuniones y negocios",
  scenario: "Negociar precio con proveedor",
  progressByLanguage: { Inglés: 1 },
  onboarded: false,
};

/** Current stage index for whatever language the learner has active right now. */
export function getStageIndex(profile: TutorProfile): number {
  return profile.progressByLanguage[profile.targetLanguage] ?? 0;
}

/** Patch to advance (or set) the stage for the learner's current language. */
export function withStageIndex(profile: TutorProfile, index: number): Partial<TutorProfile> {
  return { progressByLanguage: { ...profile.progressByLanguage, [profile.targetLanguage]: index } };
}
