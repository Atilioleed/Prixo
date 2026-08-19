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
  stageIndex: number; // index into the curriculum stages the learner has reached
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
  stageIndex: 1,
  onboarded: false,
};

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
