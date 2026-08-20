"use client";

import { useState } from "react";
import ScreenHead from "@/components/ScreenHead";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { usePlan } from "@/context/PlanContext";
import { IconTarget, IconCalendar, IconPlus, IconClose } from "@/components/icons/Icon";

const EXAMPLES = [
  "Tengo un negocio en China y voy a negociar en inglés con un proveedor el precio de un pedido grande.",
  "Viajo a Europa por 3 semanas: aeropuertos, hoteles, restaurantes y tours guiados, todo en inglés.",
  "Tengo una entrevista de trabajo en inglés para una posición de marketing en 10 días.",
];

function planLabel(context: string) {
  return context.length > 34 ? context.slice(0, 34) + "…" : context;
}

export default function Planning({
  onPracticeScenario,
}: {
  onPracticeScenario: (scenario: string) => void;
}) {
  const { profile } = useTutorProfile();
  const { plans, activePlan, activePlanId, addPlan, setActivePlanId, removePlan } = usePlan();
  const [context, setContext] = useState("");
  const [deadline, setDeadline] = useState("");
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
      addPlan({
        context,
        deadline,
        shortTerm: data.shortTerm,
        longTerm: data.longTerm,
        milestones: data.milestones,
        scenarios: data.scenarios,
      });
      setContext("");
      setDeadline("");
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
        description="Cuéntale a la IA tu situación real — un negocio, un viaje, una entrevista — y arma un plan de estudio a tu medida. Puedes crear todos los planes que quieras mientras tu cuenta esté activa."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
        <div className="panel panel-bracketed p-5">
          <label className="data-label block mb-2">
            <IconPlus size={11} className="inline mr-1" />
            Nuevo plan — cuéntame tu objetivo
          </label>
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
            {loading ? "Armando tu plan…" : "Generar nuevo plan"}
          </button>
          {error && <p className="text-xs text-red mt-2.5">{error}</p>}
          <p className="text-[11px] text-text-faint mt-2.5 leading-relaxed">
            No hay límite de planes mientras tu cuenta esté activa — arma uno por cada
            objetivo distinto.
          </p>
        </div>

        <div>
          {plans.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`lift flex items-center gap-1.5 border rounded-[var(--radius-chip)] pl-3 pr-1.5 py-1.5 text-[12px] font-semibold ${
                    p.id === activePlanId
                      ? "bg-amber text-[#1a1400] border-amber"
                      : "border-line text-text-soft bg-ground-raised-2 hover:border-line-bright"
                  }`}
                >
                  <button onClick={() => setActivePlanId(p.id)}>{planLabel(p.context)}</button>
                  <button
                    onClick={() => removePlan(p.id)}
                    title="Eliminar plan"
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      p.id === activePlanId ? "text-[#1a1400]/60 hover:text-[#1a1400]" : "text-text-faint hover:text-red"
                    }`}
                  >
                    <IconClose size={10} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!activePlan && !loading && (
            <div className="border border-dashed border-line rounded-[14px] p-8 text-center text-text-faint text-sm">
              {plans.length > 0
                ? "Elige un plan de arriba para verlo, o arma uno nuevo a la izquierda."
                : "Tu plan va a aparecer acá — cuéntame tu situación a la izquierda para empezar."}
            </div>
          )}

          {activePlan && (
            <div className="flex flex-col gap-4">
              <div className="panel p-5">
                <div className="data-label text-amber mb-2">Metas de corto plazo</div>
                <ul className="flex flex-col gap-1.5">
                  {activePlan.shortTerm.map((g, i) => (
                    <li key={i} className="text-sm text-text-soft flex gap-2">
                      <span className="text-amber">—</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-5">
                <div className="data-label text-amber mb-2">Metas de largo plazo</div>
                <ul className="flex flex-col gap-1.5">
                  {activePlan.longTerm.map((g, i) => (
                    <li key={i} className="text-sm text-text-soft flex gap-2">
                      <span className="text-amber">—</span> {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-5">
                <div className="data-label text-amber mb-3">Hitos</div>
                <div className="flex flex-col gap-2.5">
                  {activePlan.milestones.map((m, i) => (
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
                  {activePlan.scenarios.map((s, i) => (
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
