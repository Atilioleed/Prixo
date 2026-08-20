"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

interface Ctx {
  profile: TutorProfile;
  update: (patch: Partial<TutorProfile>) => void;
  ready: boolean;
}

const TutorProfileContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "prixo-tutor-profile";

export function TutorProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<TutorProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-shot hydration from localStorage on mount, not a state sync loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      // ignore malformed storage
    } finally {
      setReady(true);
    }
  }, []);

  const update = (patch: Partial<TutorProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  };

  return (
    <TutorProfileContext.Provider value={{ profile, update, ready }}>
      {children}
    </TutorProfileContext.Provider>
  );
}

export function useTutorProfile() {
  const ctx = useContext(TutorProfileContext);
  if (!ctx) throw new Error("useTutorProfile must be used within TutorProfileProvider");
  return ctx;
}
