"use client";

import { useEffect, useState } from "react";
import Pill from "@/components/Pill";
import { LANGUAGES } from "@/lib/languageCodes";
import { AGE_RANGES } from "@/lib/onboardingOptions";
import { IconPlus, IconClose } from "@/components/icons/Icon";
import type { TestQuestion } from "@/lib/tests";

interface TestRow {
  id: string;
  title: string;
  language: string;
  ageRange: string;
  level: string;
  kind: "checkpoint" | "final";
  passingScore: number;
  questions: TestQuestion[];
  status: "draft" | "published";
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const KINDS: { value: "checkpoint" | "final"; label: string }[] = [
  { value: "final", label: "Examen final (avanza de etapa)" },
  { value: "checkpoint", label: "Chequeo (no avanza de etapa)" },
];

function emptyQuestion(): TestQuestion {
  return { id: crypto.randomUUID(), prompt: "", options: ["", "", "", ""], correctIndex: 0 };
}

const EMPTY_DRAFT = {
  title: "",
  language: "Inglés",
  ageRange: "adulto",
  level: "A1",
  kind: "final" as "checkpoint" | "final",
  passingScore: 70,
  questions: [emptyQuestion()],
};

export default function TestsPanel() {
  const [rows, setRows] = useState<TestRow[] | null>(null);
  const [dbReady, setDbReady] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/tests")
      .then((r) => r.json())
      .then((data) => {
        if (data.tests) {
          setRows(data.tests);
          setDbReady(data.dbConfigured);
        }
      })
      .catch(() => {});
  }

  useEffect(load, []);

  function updateQuestion(i: number, patch: Partial<TestQuestion>) {
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q, qi) => (qi === i ? { ...q, ...patch } : q)),
    }));
  }

  function updateOption(qi: number, oi: number, value: string) {
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, oidx) => (oidx === oi ? value : o)) } : q
      ),
    }));
  }

  function addQuestion() {
    setDraft((d) => ({ ...d, questions: [...d.questions, emptyQuestion()] }));
  }

  function removeQuestion(i: number) {
    setDraft((d) => ({ ...d, questions: d.questions.filter((_, qi) => qi !== i) }));
  }

  function validQuestions() {
    return draft.questions.every(
      (q) => q.prompt.trim() && q.options.every((o) => o.trim())
    );
  }

  async function create() {
    if (!draft.title.trim() || !validQuestions()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo crear.");
        return;
      }
      setDraft(EMPTY_DRAFT);
      setShowForm(false);
      load();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(t: TestRow) {
    await fetch(`/api/admin/tests/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: t.status === "published" ? "draft" : "published" }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/tests/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="text-[19px] font-bold text-text">Pruebas y evaluaciones</h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={!dbReady}
          className="lift glow-amber flex items-center gap-1.5 text-[11.5px] font-bold border-none rounded-[8px] px-3 py-2 bg-amber text-[#1a1400] disabled:opacity-40"
        >
          <IconPlus size={12} /> Nueva prueba
        </button>
      </div>
      <div className="text-[12.5px] text-text-soft mb-[18px]">
        Exámenes de opción múltiple, reales. Un examen &quot;final&quot; publicado para un
        idioma + edad + nivel es lo que el botón &quot;Rendir&quot; del Temario usa de
        verdad — mientras no exista uno, ese botón sigue en modo demo (avanza sin
        evaluar).
      </div>

      {!dbReady && (
        <div className="panel panel-bracketed p-4 mb-4 text-[12.5px] text-amber bg-amber-tint">
          Todavía no hay base de datos conectada — no se pueden crear ni guardar
          pruebas hasta conectar una.
        </div>
      )}

      {showForm && (
        <div className="panel panel-bracketed p-4 mb-4 flex flex-col gap-2.5">
          <input
            placeholder="Título de la prueba"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            <select
              value={draft.language}
              onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {LANGUAGES.map((l) => (
                <option key={l.label} value={l.label}>{l.label}</option>
              ))}
            </select>
            <select
              value={draft.ageRange}
              onChange={(e) => setDraft((d) => ({ ...d, ageRange: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {AGE_RANGES.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
            <select
              value={draft.level}
              onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={draft.kind}
              onChange={(e) => setDraft((d) => ({ ...d, kind: e.target.value as "checkpoint" | "final" }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={100}
              value={draft.passingScore}
              onChange={(e) => setDraft((d) => ({ ...d, passingScore: Number(e.target.value) }))}
              placeholder="% para aprobar"
              className="w-full border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            />
          </div>

          <div className="data-label mt-2">Preguntas</div>
          {draft.questions.map((q, qi) => (
            <div key={q.id} className="border border-line rounded-[10px] p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  placeholder={`Pregunta ${qi + 1}`}
                  value={q.prompt}
                  onChange={(e) => updateQuestion(qi, { prompt: e.target.value })}
                  className="flex-1 border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
                />
                {draft.questions.length > 1 && (
                  <button onClick={() => removeQuestion(qi)} className="text-text-faint hover:text-red shrink-0">
                    <IconClose size={13} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-2 border rounded-[8px] px-2.5 py-2 ${
                      q.correctIndex === oi ? "border-cyan-dim/50 bg-cyan-tint" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, { correctIndex: oi })}
                      className="shrink-0"
                    />
                    <input
                      placeholder={`Opción ${oi + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      className="flex-1 min-w-0 border-none bg-transparent text-[12.5px] text-text outline-none"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="self-start flex items-center gap-1.5 text-[11.5px] font-semibold text-cyan hover:text-text"
          >
            <IconPlus size={11} /> Agregar pregunta
          </button>

          {error && <p className="text-[11.5px] text-red">{error}</p>}
          <div className="flex gap-2 mt-1">
            <button
              onClick={create}
              disabled={saving || !draft.title.trim() || !validQuestions()}
              className="lift glow-amber text-[11.5px] font-bold border-none rounded-[8px] px-3.5 py-2 bg-amber text-[#1a1400] disabled:opacity-50"
            >
              {saving ? "Creando…" : "Crear como borrador"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-[11.5px] font-semibold text-text-faint hover:text-text"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!rows ? (
        <div className="text-[12.5px] text-text-faint">Cargando…</div>
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-line rounded-[10px] p-6 text-center text-text-faint text-[12.5px]">
          Todavía no hay pruebas. Crea la primera con &quot;Nueva prueba&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Prueba", "Idioma", "Edad", "Nivel", "Tipo", "Preguntas", "Aprobación", "Estado", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10.5px] uppercase tracking-[0.05em] text-text-faint px-2.5 py-2 border-b-[1.5px] border-line">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">{t.title}</td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">{t.language}</td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">
                    {AGE_RANGES.find((a) => a.value === t.ageRange)?.label ?? t.ageRange}
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-line"><Pill variant="a1">{t.level}</Pill></td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">
                    {t.kind === "final" ? "Final" : "Chequeo"}
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text tabular">{t.questions.length}</td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text tabular">{t.passingScore}%</td>
                  <td className="px-2.5 py-2.5 border-b border-line">
                    <button onClick={() => toggleStatus(t)}>
                      <Pill variant={t.status === "published" ? "pub" : "draft"}>
                        {t.status === "published" ? "Publicado" : "Borrador"}
                      </Pill>
                    </button>
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-line">
                    <button onClick={() => remove(t.id)} className="text-text-faint hover:text-red">
                      <IconClose size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
