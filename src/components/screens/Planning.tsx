"use client";

import { useState } from "react";
import ScreenHead from "@/components/ScreenHead";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { usePlan, LearningPlan } from "@/context/PlanContext";
import { IconTarget, IconCalendar } from "@/components/icons/Icon";

const EXAMPLES = [
  "Tengo un negocio en China y voy a negociar en inglés con un proveedor el precio de un pedido grande.",
  "Viajo a Europa por 3 semanas: aeropuertos, hoteles, restaurantes y tours guiados, todo en inglés.",
  "Tengo una entrevista de trabajo en inglés para una posición de marketing en 10 días.",
];

export default function Planning({
  onPracticeScenario,
}: {
  onPracticeScenario: (scenario: string) => void;
}) {
  const { profile } = useTutorProfile();
  const { plan, setPlan } = usePlan();
  const [context, setContext] = useState(plan?.context ?? "");
  const [deadline, setDeadline] = useState(plan?.deadline ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generatePlan() {
    if (!context.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, deadline, profile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo generar el plan.");
        return;
      }
      const next: LearningPlan = {
        context,
        deadline,
        shortTerm: data.shortTerm,
        longTerm: data.longTerm,
        milestones: data.milestones,
        scenarios: data.scenarios,
        generatedAt: new Date().toISOString(),
      };
      setPlan(next);
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo `npm run dev`?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ScreenHead
        title="Prepárate para lo que realmente te importa"
        description="Cuéntale a la IA tu situación real — un negocio, un viaje, una entrevista — y arma un plan de estudio a tu medida, con metas de corto y largo plazo y escenarios de práctica específicos."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
        <div className="panel panel-bracketed p-5">
          <label className="data-label block mb-2">Cuéntame tu objetivo</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={5}
            placeholder="Ej. Tengo un negocio en China y voy a negociar en inglés con un proveedor sobre el precio de un pedido…"
            className="w-full border border-line rounded-[10px] px-3.5 py-3 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text placeholder:text-text-faint resize-none mb-3"
          />
          <div className="flex flex-wrap gap-1.5 mb-4">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setContext(ex)}
                className="text-[11px] border border-line rounded-[var(--radius-chip)] px-2.5 py-1 text-text-soft hover:border-line-bright bg-ground-raised-2"
              >
                {ex.slice(0, 34)}…
              </button>
            ))}
          </div>

          <label className="data-label flex items-center gap-1.5 mb-2">
            <IconCalendar size={11} /> Fecha límite (opcional)
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border border-line rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text mb-4"
          />

          <button
            onClick={generatePlan}
            disabled={!context.trim() || loading}
            className="lift glow-amber w-full border-none px-4 py-3 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "Armando tu plan…" : plan ? "Regenerar plan" : "Generar mi plan"}
          </button>
          {error && <p className="text-xs text-red mt-2.5">{error}</p>}
        </div>

        <div>
          {!plan && !loading && (
            <div className="border border-dashed border-line rounded-[14px] p-8 text-center text-text-faint text-sm">
              Tu plan va a aparecer acá — cuéntame tu situación a la izquierda para empezar.
            </div>
          )}

          {plan && (
            <div className="flex flex-col gap-4">
              <div className="panel p-5">
                <div className="data-label text-amber mb-2">Metas de corto plazo</div>
                <ul className="flex flex-col gap-1.5">
                  {plan.shortTerm.map((g, i) => (
                    <li key={i} className="text-sm text-text-soft flex gap-2">
                      <span className="text-amber">—</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-5">
                <div className="data-label text-amber mb-2">Metas de largo plazo</div>
                <ul className="flex flex-col gap-1.5">
                  {plan.longTerm.map((g, i) => (
                    <li key={i} className="text-sm text-text-soft flex gap-2">
                      <span className="text-amber">—</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-5">
                <div className="data-label text-amber mb-3">Hitos</div>
                <div className="flex flex-col gap-2.5">
                  {plan.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
                      <div className="text-sm text-text">
                        <span className="font-semibold">{m.title}</span>{" "}
                        <span className="text-text-faint text-xs">— {m.when}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel panel-bracketed p-5 bg-ground-raised">
                <div className="data-label text-amber mb-3 flex items-center gap-1.5">
                  <IconTarget size={12} /> Escenarios sugeridos para practicar
                </div>
                <div className="flex flex-col gap-2">
                  {plan.scenarios.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 bg-ground-raised-2 border border-line rounded-[10px] px-3.5 py-2.5"
                    >
                      <span className="text-sm text-text">{s}</span>
                      <button
                        onClick={() => onPracticeScenario(s)}
                        className="shrink-0 border-none bg-amber text-[#1a1400] px-3 py-1.5 rounded-[var(--radius-chip)] font-bold text-[11px]"
                      >
                        Practicar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
