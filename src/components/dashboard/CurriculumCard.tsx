"use client";

import { useState } from "react";
import { stagesFor, randomMotivationalMessage } from "@/lib/curriculum";
import { useTutorProfile, getStageIndex, withStageIndex } from "@/context/TutorProfileContext";
import { useSessions } from "@/context/SessionsContext";
import { IconCheck, IconMedal, IconMessageDots } from "@/components/icons/Icon";
import TestModal from "./TestModal";

export default function CurriculumCard({ onPracticeStage }: { onPracticeStage: (topic: string) => void }) {
  const { profile, update } = useTutorProfile();
  const { logSession } = useSessions();
  const stages = stagesFor(profile.ageRange);
  const current = Math.min(getStageIndex(profile), stages.length - 1);
  const [justPassed, setJustPassed] = useState<number | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [showTest, setShowTest] = useState(false);

  function passFinal() {
    const index = current;
    const next = Math.min(current + 1, stages.length - 1);
    const finalTest = stages[index].tests.find((t) => t.kind === "final")?.title ?? stages[index].tests.at(-1)?.title ?? "";
    update(withStageIndex(profile, next));
    logSession("review", `Aprobó "${finalTest}" — avanzó a ${stages[next].level}`);
    setJustPassed(index);
    setCelebration(randomMotivationalMessage(profile.ageRange));
    setTimeout(() => {
      setJustPassed(null);
      setCelebration(null);
    }, 2600);
  }

  return (
    <div className="panel p-5">
      <div className="data-label text-amber mb-3.5">Temario</div>
      <div className="flex flex-col gap-2.5">
        {stages.map((stage, i) => {
          const status = i < current ? "done" : i === current ? "current" : "locked";
          const celebrating = justPassed === i;
          const finalTest = stage.tests.find((t) => t.kind === "final");
          const checkpoints = stage.tests.filter((t) => t.kind === "checkpoint");
          return (
            <div
              key={stage.level}
              className={`relative rounded-[10px] p-3.5 border transition-colors duration-500 ${
                status === "current" ? "border-amber-dim/50 bg-amber-tint" : "border-line bg-ground-raised-2"
              } ${status === "locked" ? "opacity-45" : ""} ${celebrating ? "border-cyan bg-cyan-tint" : ""}`}
            >
              {celebrating && <span className="burst-ring" style={{ borderColor: "var(--cyan)" }} />}
              <div className="flex items-center justify-between gap-3 min-w-0">
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
                    onClick={() => setShowTest(true)}
                    className="lift glow-amber shrink-0 border-none bg-amber text-[#1a1400] px-3 py-2 rounded-[var(--radius-chip)] font-bold text-[10.5px] whitespace-nowrap"
                    title="Rinde el examen final de esta etapa"
                  >
                    Rendir {finalTest?.title}
                  </button>
                )}
                {status === "done" && (
                  <span className="shrink-0 text-[10.5px] font-bold text-cyan">Completado</span>
                )}
              </div>

              {status === "current" && (
                <div className="mt-3 pl-12 flex flex-col gap-2">
                  <div className="data-label text-text-faint">
                    Practica un tema con tu tutor ahora
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stage.topics.map((t) => (
                      <button
                        key={t}
                        onClick={() => onPracticeStage(t)}
                        className="lift flex items-center gap-1.5 text-[10.5px] font-medium text-text-soft bg-ground-raised border border-line rounded-[var(--radius-chip)] px-2 py-1 hover:border-cyan-dim/50 hover:text-cyan"
                      >
                        <IconMessageDots size={10} />
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="data-label text-text-faint">
                    {checkpoints.length} chequeos en el camino + 1 examen final
                  </div>
                </div>
              )}

              {celebrating && celebration && (
                <div className="mt-3 pl-12 flex items-center gap-2 text-[12.5px] font-semibold text-cyan animate-fade-up">
                  <IconMedal size={14} />
                  {celebration}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-text-faint mt-3">
        &quot;Rendir&quot; abre el examen real de la etapa cuando el equipo de Prixo lo
        publicó (Panel admin → Pruebas y evaluaciones); si todavía no existe, ofrece
        simular la aprobación mientras tanto.
      </p>
      {showTest && (
        <TestModal
          language={profile.targetLanguage}
          ageRange={profile.ageRange}
          level={stages[current].level}
          onClose={() => setShowTest(false)}
          onPassed={passFinal}
        />
      )}
    </div>
  );
}
