"use client";

import { usePlan } from "@/context/PlanContext";

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function PlanSummaryCard({ onGoToPlanning }: { onGoToPlanning: () => void }) {
  const { plans, activePlan } = usePlan();
  const days = activePlan?.deadline ? daysUntil(activePlan.deadline) : null;

  return (
    <div className="panel panel-bracketed p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="data-label text-amber">Plan de trabajo</div>
          {plans.length > 1 && (
            <span className="text-[10.5px] font-semibold text-cyan bg-cyan-tint px-2 py-0.5 rounded-[var(--radius-chip)]">
              {plans.length} planes
            </span>
          )}
        </div>
        <button onClick={onGoToPlanning} className="text-[11.5px] font-semibold text-cyan hover:text-text">
          {plans.length > 0 ? "Ver todos →" : "Crear plan →"}
        </button>
      </div>

      {activePlan ? (
        <>
          {days !== null && (
            <div className="flex items-baseline gap-2 mb-4">
              <span className="tabular font-display font-bold text-3xl text-amber">
                T-{days >= 0 ? days : 0}
              </span>
              <span className="text-xs text-text-faint">días para tu fecha límite</span>
            </div>
          )}
          <p className="text-sm text-text-soft mb-3 leading-relaxed">{activePlan.context}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {activePlan.shortTerm.slice(0, 2).map((g, i) => (
              <span key={i} className="text-[11px] bg-cyan-tint text-cyan font-semibold px-2.5 py-1 rounded-[var(--radius-chip)]">
                {g.length > 40 ? g.slice(0, 40) + "…" : g}
              </span>
            ))}
          </div>
          {activePlan.milestones[0] && (
            <div className="text-[12.5px] text-text-soft">
              Próximo hito: <span className="font-semibold text-text">{activePlan.milestones[0].title}</span> — {activePlan.milestones[0].when}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-text-soft">
          Todavía no armaste un plan. Cuéntale a la IA tu objetivo real (un negocio, un
          viaje, una entrevista) para generar uno.
        </p>
      )}
    </div>
  );
}
