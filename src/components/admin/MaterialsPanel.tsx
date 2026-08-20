"use client";

import { useEffect, useState } from "react";
import Pill from "@/components/Pill";
import { LANGUAGES } from "@/lib/languageCodes";
import { IconPlus, IconClose, IconLoop } from "@/components/icons/Icon";

interface Material {
  id: string;
  title: string;
  level: string;
  type: string;
  language: string;
  content: string;
  status: "draft" | "published";
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const TYPES = ["Vocabulario", "Gramática", "Lección"];
const GENERATE_BATCH_SIZE = 3; // must match MAX_TOPICS_PER_BATCH in the generate API route

const EMPTY_DRAFT = { title: "", level: "A1", type: "Vocabulario", language: "Inglés", content: "" };
const EMPTY_GEN = { language: "Inglés", level: "A1", type: "Vocabulario", topics: "" };

interface GenProgress {
  total: number;
  done: number;
  createdCount: number;
  failed: { topic: string; error: string }[];
  running: boolean;
}

export default function MaterialsPanel() {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [dbReady, setDbReady] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [gen, setGen] = useState(EMPTY_GEN);
  const [genProgress, setGenProgress] = useState<GenProgress | null>(null);

  function load() {
    fetch("/api/admin/materials")
      .then((r) => r.json())
      .then((data) => {
        if (data.materials) {
          setMaterials(data.materials);
          setDbReady(data.dbConfigured);
        }
      })
      .catch(() => {});
  }

  useEffect(load, []);

  async function create() {
    if (!draft.title.trim() || !draft.content.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/materials", {
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

  async function generateBatch() {
    const topics = gen.topics
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    if (topics.length === 0) return;

    setGenProgress({ total: topics.length, done: 0, createdCount: 0, failed: [], running: true });

    for (let i = 0; i < topics.length; i += GENERATE_BATCH_SIZE) {
      const chunk = topics.slice(i, i + GENERATE_BATCH_SIZE);
      try {
        const res = await fetch("/api/admin/materials/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topics: chunk, language: gen.language, level: gen.level, type: gen.type }),
        });
        const data = await res.json();
        setGenProgress((p) =>
          p
            ? {
                ...p,
                done: p.done + chunk.length,
                createdCount: p.createdCount + (data.created?.length ?? 0),
                failed: [...p.failed, ...(data.failed ?? [])],
              }
            : p
        );
        load();
      } catch {
        setGenProgress((p) =>
          p
            ? {
                ...p,
                done: p.done + chunk.length,
                failed: [...p.failed, ...chunk.map((topic: string) => ({ topic, error: "No se pudo conectar." }))],
              }
            : p
        );
      }
    }

    setGenProgress((p) => (p ? { ...p, running: false } : p));
  }

  async function toggleStatus(m: Material) {
    await fetch(`/api/admin/materials/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: m.status === "published" ? "draft" : "published" }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/materials/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="text-[19px] font-bold text-text">Documentos de aprendizaje</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGenerate((v) => !v)}
            disabled={!dbReady}
            className="lift flex items-center gap-1.5 text-[11.5px] font-bold border border-cyan-dim/50 rounded-[8px] px-3 py-2 text-cyan disabled:opacity-40"
          >
            <IconLoop size={12} /> Generar con IA
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            disabled={!dbReady}
            className="lift glow-amber flex items-center gap-1.5 text-[11.5px] font-bold border-none rounded-[8px] px-3 py-2 bg-amber text-[#1a1400] disabled:opacity-40"
          >
            <IconPlus size={12} /> Nuevo documento
          </button>
        </div>
      </div>
      <div className="text-[12.5px] text-text-soft mb-[18px]">
        Lecciones, vocabulario y material de gramática que alimentan a la IA por idioma y
        nivel. Los publicados son los mismos que el alumno ve en &quot;Materiales&quot;.
      </div>

      {!dbReady && (
        <div className="panel panel-bracketed p-4 mb-4 text-[12.5px] text-amber bg-amber-tint">
          Todavía no hay base de datos conectada — no se pueden crear ni guardar
          documentos hasta conectar una.
        </div>
      )}

      {showGenerate && (
        <div className="panel panel-bracketed p-4 mb-4 flex flex-col gap-2.5">
          <div className="text-[11.5px] text-text-soft leading-relaxed">
            Un tema por línea. Cada uno genera un documento bilingüe completo (vocabulario,
            frases, ejemplos) con la IA — siempre queda como <strong>borrador</strong> para
            que lo revises antes de publicarlo.
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <select
              value={gen.language}
              onChange={(e) => setGen((g) => ({ ...g, language: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {LANGUAGES.map((l) => (
                <option key={l.label} value={l.label}>{l.label}</option>
              ))}
            </select>
            <select
              value={gen.level}
              onChange={(e) => setGen((g) => ({ ...g, level: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={gen.type}
              onChange={(e) => setGen((g) => ({ ...g, type: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder={"Un tema por línea, ej.:\nVocabulario — en el aeropuerto\nPresente continuo\nCómo pedir en un restaurante"}
            value={gen.topics}
            onChange={(e) => setGen((g) => ({ ...g, topics: e.target.value }))}
            rows={6}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber resize-none"
          />
          <button
            onClick={generateBatch}
            disabled={!gen.topics.trim() || genProgress?.running}
            className="self-start lift text-[11.5px] font-bold border-none rounded-[8px] px-3.5 py-2 bg-cyan text-[#04201d] disabled:opacity-50"
          >
            {genProgress?.running
              ? `Generando… ${genProgress.done}/${genProgress.total}`
              : `Generar ${gen.topics.split("\n").filter((t) => t.trim()).length || ""} documentos`.trim()}
          </button>
          {genProgress && !genProgress.running && (
            <div className="text-[11.5px] text-text-soft">
              {genProgress.createdCount} creados como borrador.
              {genProgress.failed.length > 0 && (
                <span className="text-red"> {genProgress.failed.length} fallaron: {genProgress.failed.map((f) => f.topic).join(", ")}.</span>
              )}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="panel panel-bracketed p-4 mb-4 flex flex-col gap-2.5">
          <input
            placeholder="Título del documento"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
          />
          <div className="grid grid-cols-3 gap-2.5">
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
              value={draft.level}
              onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select
              value={draft.type}
              onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
              className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Contenido en markdown…"
            value={draft.content}
            onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
            rows={8}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[12px] font-mono bg-ground-raised-2 text-text outline-none focus:border-amber resize-none"
          />
          {error && <p className="text-[11.5px] text-red">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={create}
              disabled={saving || !draft.title.trim() || !draft.content.trim()}
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

      {!materials ? (
        <div className="text-[12.5px] text-text-faint">Cargando…</div>
      ) : materials.length === 0 ? (
        <div className="border border-dashed border-line rounded-[10px] p-6 text-center text-text-faint text-[12.5px]">
          Todavía no hay documentos. Crea el primero con &quot;Nuevo documento&quot;.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Documento", "Idioma", "Nivel", "Tipo", "Estado", ""].map((h) => (
                  <th key={h} className="text-left font-mono text-[10.5px] uppercase tracking-[0.05em] text-text-faint px-2.5 py-2 border-b-[1.5px] border-line">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id}>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">{m.title}</td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">{m.language}</td>
                  <td className="px-2.5 py-2.5 border-b border-line"><Pill variant="a1">{m.level}</Pill></td>
                  <td className="px-2.5 py-2.5 border-b border-line text-text">{m.type}</td>
                  <td className="px-2.5 py-2.5 border-b border-line">
                    <button onClick={() => toggleStatus(m)}>
                      <Pill variant={m.status === "published" ? "pub" : "draft"}>
                        {m.status === "published" ? "Publicado" : "Borrador"}
                      </Pill>
                    </button>
                  </td>
                  <td className="px-2.5 py-2.5 border-b border-line">
                    <button onClick={() => remove(m.id)} className="text-text-faint hover:text-red">
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
