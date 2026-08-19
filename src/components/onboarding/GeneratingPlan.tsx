"use client";

import { useEffect, useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { GOALS } from "@/lib/onboardingOptions";
import type { TutorProfile } from "@/context/TutorProfileContext";
import { IconCheck } from "@/components/icons/Icon";

const CHECKLIST = [
  "Analizando tu nivel de partida",
  "Eligiendo el tono de tu tutor",
  "Preparando tus primeras conversaciones",
  "Armando tu ruta de aprendizaje",
];

export default function GeneratingPlan({
  profile,
  onComplete,
}: {
  profile: TutorProfile;
  onComplete: () => void;
}) {
  const { addPlan } = usePlan();
  const [doneCount, setDoneCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timers = CHECKLIST.map((_, i) =>
      setTimeout(() => setDoneCount((c) => Math.max(c, i + 1)), 650 * (i + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const goalLabel = GOALS.find((g) => g.value === profile.planGoal)?.label ?? "aprender el idioma";
    const context = `Objetivo principal: ${goalLabel}. Nivel de partida autoevaluado: ${profile.currentLevel}. Lengua materna: ${profile.nativeLanguage}.`;

    let cancelled = false;
    async function run() {
      try {
        const res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context, deadline: "", profile }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          addPlan({
            context,
            deadline: "",
            shortTerm: data.shortTerm,
            longTerm: data.longTerm,
            milestones: data.milestones,
            scenarios: data.scenarios,
          });
        } else {
          setError(data.error ?? null);
        }
      } catch {
        if (!cancelled) setError("No se pudo conectar con el servidor.");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allDone = doneCount >= CHECKLIST.length;

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <div className="relative w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--seal-violet),var(--pink),var(--amber),var(--cyan),var(--seal-lime),var(--seal-violet))] animate-seal-spin" />
          <div className="relative w-[68px] h-[68px] rounded-full bg-ground flex items-center justify-center font-display font-bold text-2xl text-text">
            {profile.avatarName[0]}
          </div>
        </div>
        <h2 className="font-display text-xl font-bold mb-1.5 text-text">Armando tu plan…</h2>
        <p className="text-sm text-text-soft mb-7">
          {profile.avatarName} está preparando tu experiencia a medida.
        </p>
        <div className="flex flex-col gap-2.5 text-left mb-6">
          {CHECKLIST.map((item, i) => {
            const done = i < doneCount;
            return (
              <div
                key={item}
                className={`animate-fade-up flex items-center gap-3 border rounded-[10px] px-4 py-3 transition-colors ${
                  done ? "border-cyan-dim/40 bg-cyan-tint" : "border-line bg-ground-raised"
                }`}
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    done ? "bg-cyan border-cyan text-ground" : "border-line-bright text-transparent"
                  }`}
                >
                  <IconCheck size={11} strokeWidth={2.5} />
                </div>
                <span className={`text-[13px] font-medium ${done ? "text-text" : "text-text-faint"}`}>{item}</span>
              </div>
            );
          })}
        </div>
        {error && (
          <p className="text-xs text-red mb-4">
            {error} — igual podés armar tu plan más tarde desde Planificación.
          </p>
        )}
        <button
          onClick={onComplete}
          disabled={!allDone}
          className="lift glow-amber w-full border-none px-5 py-3.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[14.5px] disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {allDone ? "Entrar a Prixo" : "Preparando…"}
        </button>
      </div>
    </div>
  );
}
