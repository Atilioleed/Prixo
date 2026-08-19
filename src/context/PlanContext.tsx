"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface PlanMilestone {
  title: string;
  when: string;
}

export interface LearningPlan {
  id: string;
  context: string;
  deadline: string;
  shortTerm: string[];
  longTerm: string[];
  milestones: PlanMilestone[];
  scenarios: string[];
  generatedAt: string;
}

interface StoredState {
  plans: LearningPlan[];
  activePlanId: string | null;
}

interface Ctx {
  plans: LearningPlan[];
  activePlanId: string | null;
  activePlan: LearningPlan | null;
  /** Creates a new plan (no limit while the account is active) and makes it the active one. */
  addPlan: (data: Omit<LearningPlan, "id" | "generatedAt">) => LearningPlan;
  setActivePlanId: (id: string) => void;
  removePlan: (id: string) => void;
}

const PlanContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "prixo-learning-plan";

function persist(state: StoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable, keep in-memory only
  }
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [activePlanId, setActivePlanIdState] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.plans)) {
          // One-shot hydration from localStorage on mount, not a state sync loop.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPlans(parsed.plans);
          setActivePlanIdState(parsed.activePlanId ?? null);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  function addPlan(data: Omit<LearningPlan, "id" | "generatedAt">): LearningPlan {
    const next: LearningPlan = {
      ...data,
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
    };
    setPlans((prev) => {
      const nextPlans = [...prev, next];
      persist({ plans: nextPlans, activePlanId: next.id });
      return nextPlans;
    });
    setActivePlanIdState(next.id);
    return next;
  }

  function setActivePlanId(id: string) {
    setActivePlanIdState(id);
    persist({ plans, activePlanId: id });
  }

  function removePlan(id: string) {
    setPlans((prev) => {
      const nextPlans = prev.filter((p) => p.id !== id);
      const nextActiveId =
        activePlanId === id ? (nextPlans[nextPlans.length - 1]?.id ?? null) : activePlanId;
      persist({ plans: nextPlans, activePlanId: nextActiveId });
      setActivePlanIdState(nextActiveId);
      return nextPlans;
    });
  }

  const activePlan = plans.find((p) => p.id === activePlanId) ?? null;

  return (
    <PlanContext.Provider value={{ plans, activePlanId, activePlan, addPlan, setActivePlanId, removePlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
