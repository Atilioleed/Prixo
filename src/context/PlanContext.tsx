"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface PlanMilestone {
  title: string;
  when: string;
}

export interface LearningPlan {
  context: string;
  deadline: string;
  shortTerm: string[];
  longTerm: string[];
  milestones: PlanMilestone[];
  scenarios: string[];
  generatedAt: string;
}

interface Ctx {
  plan: LearningPlan | null;
  setPlan: (plan: LearningPlan | null) => void;
}

const PlanContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "prixo-learning-plan";

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<LearningPlan | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-shot hydration from localStorage on mount, not a state sync loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setPlanState(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const setPlan = (next: LearningPlan | null) => {
    setPlanState(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable, keep in-memory only
    }
  };

  return <PlanContext.Provider value={{ plan, setPlan }}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
