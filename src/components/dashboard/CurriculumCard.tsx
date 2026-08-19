"use client";

import { useState } from "react";
import { STAGES } from "@/lib/curriculum";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { useSessions } from "@/context/SessionsContext";
import { IconCheck } from "@/components/icons/Icon";

export default function CurriculumCard() {
  const { profile, update } = useTutorProfile();
  const { logSession } = useSessions();
  const current = Math.min(profile.stageIndex, STAGES.length - 1);
  const [justPassed, setJustPassed] = useState<number | null>(null);

  function passTest(index: number) {
    if (index !== current) return;
    const next = Math.min(current + 1, STAGES.length - 1);
    update({ stageIndex: next });
    logSession("review", `Aprobó "${STAGES[index].test}" — avanzó a ${STAGES[next].level}`);
    setJustPassed(index);
    setTimeout(() => setJustPassed(null), 900);
  }

  return (
    <div className="panel p-5">
      <div className="data-label text-amber mb-3.5">Temario</div>
      <div className="flex flex-col gap-2.5">
        {STAGES.map((stage, i) => {
          const status = i < current ? "done" : i === current ? "current" : "locked";
          const celebrating = justPassed === i;
          return (
            <div
              key={stage.level}
              className={`relative flex items-center justify-between gap-3 rounded-[10px] p-3.5 border transition-colors duration-500 ${
                status === "current" ? "border-amber-dim/50 bg-amber-tint" : "border-line bg-ground-raised-2"
              } ${status === "locked" ? "opacity-45" : ""} ${celebrating ? "border-cyan bg-cyan-tint" : ""}`}
            >
              {celebrating && <span className="burst-ring" style={{ borderColor: "var(--cyan)" }} />}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-[8px] flex items-center justify-center tabular text-[11px] font-bold shrink-0 ${
                    celebrating ? "animate-burst-pop" : ""
                  } ${
                    status === "done"
                      ? "bg-cyan-tint text-cyan"
                      : status === "current"
                      ? "bg-amber text-[#1a1400]"
                      : "bg-ground-raised text-text-faint"
                  }`}
                >
                  {status === "done" ? <IconCheck size={14} strokeWidth={2.2} /> : stage.level}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[13px] text-text truncate">{stage.title}</div>
                  <div className="text-[11px] text-text-faint truncate">{stage.description}</div>
                </div>
              </div>
              {status === "current" && (
                <button
                  onClick={() => passTest(i)}
                  className="lift glow-amber shrink-0 border-none bg-amber text-[#1a1400] px-3 py-2 rounded-[var(--radius-chip)] font-bold text-[10.5px] whitespace-nowrap"
                  title="Simula rendir y aprobar la prueba de esta etapa"
                >
                  Rendir {stage.test}
                </button>
              )}
              {status === "done" && (
                <span className="shrink-0 text-[10.5px] font-bold text-cyan">Completado</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-text-faint mt-3">
        Modo demo: &quot;Rendir prueba&quot; simula la aprobación. Las pruebas reales se
        gestionan desde Panel admin → Pruebas y evaluaciones.
      </p>
    </div>
  );
}
