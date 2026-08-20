"use client";

import { useEffect, useState } from "react";
import { IconPlus, IconClose, IconLink } from "@/components/icons/Icon";

interface Source {
  id: string;
  title: string;
  url: string;
  category: string;
  notes: string;
  active: boolean;
}

const CATEGORIES = ["General", "Gramática", "Vocabulario", "Certificación", "Metodología", "Noticias"];

const EMPTY_DRAFT = { title: "", url: "", category: "General", notes: "" };

export default function KnowledgeSourcesPanel() {
  const [sources, setSources] = useState<Source[] | null>(null);
  const [dbReady, setDbReady] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/knowledge-sources")
      .then((r) => r.json())
      .then((data) => {
        if (data.sources) {
          setSources(data.sources);
          setDbReady(data.dbConfigured);
        }
      })
      .catch(() => {});
  }

  useEffect(load, []);

  async function create() {
    if (!draft.title.trim() || !draft.url.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/knowledge-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo agregar.");
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

  async function toggleActive(s: Source) {
    await fetch(`/api/admin/knowledge-sources/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/knowledge-sources/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="text-[19px] font-bold text-text">Fuentes de referencia</h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={!dbReady}
          className="lift glow-amber flex items-center gap-1.5 text-[11.5px] font-bold border-none rounded-[8px] px-3 py-2 bg-amber text-[#1a1400] disabled:opacity-40"
        >
          <IconPlus size={12} /> Nueva fuente
        </button>
      </div>
      <div className="text-[12.5px] text-text-soft mb-[18px]">
        Sitios y documentos certificados que el agente de IA usa como referencia
        para mantenerse actualizado — metodologías, gramática, noticias del idioma.
      </div>

      {!dbReady && (
        <div className="panel panel-bracketed p-4 mb-4 text-[12.5px] text-amber bg-amber-tint">
          Todavía no hay base de datos conectada — no se pueden guardar fuentes
          hasta conectar una.
        </div>
      )}

      {showForm && (
        <div className="panel panel-bracketed p-4 mb-4 flex flex-col gap-2.5">
          <input
            placeholder="Título de la fuente"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
          />
          <input
            placeholder="https://…"
            value={draft.url}
            onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[13px] bg-ground-raised-2 text-text outline-none focus:border-amber"
          />
          <select
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            className="border border-line rounded-[8px] px-2.5 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <textarea
            placeholder="Notas — qué aporta esta fuente, con qué frecuencia revisarla…"
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
            rows={3}
            className="w-full border border-line rounded-[8px] px-3 py-2 text-[12.5px] bg-ground-raised-2 text-text outline-none focus:border-amber resize-none"
          />
          {error && <p className="text-[11.5px] text-red">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={create}
              disabled={saving || !draft.title.trim() || !draft.url.trim()}
              className="lift glow-amber text-[11.5px] font-bold border-none rounded-[8px] px-3.5 py-2 bg-amber text-[#1a1400] disabled:opacity-50"
            >
              {saving ? "Agregando…" : "Agregar fuente"}
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

      {!sources ? (
        <div className="text-[12.5px] text-text-faint">Cargando…</div>
      ) : sources.length === 0 ? (
        <div className="border border-dashed border-line rounded-[10px] p-6 text-center text-text-faint text-[12.5px]">
          Todavía no hay fuentes. Agrega la primera con &quot;Nueva fuente&quot;.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sources.map((s) => (
            <div key={s.id} className="panel flex items-start gap-3 p-3.5">
              <IconLink size={15} className="text-cyan shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[13px] text-text">{s.title}</span>
                  <span className="data-label px-2 py-0.5 rounded-[var(--radius-chip)] bg-ground-raised-2 text-text-faint">
                    {s.category}
                  </span>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11.5px] text-cyan hover:underline break-all"
                >
                  {s.url}
                </a>
                {s.notes && <div className="text-[12px] text-text-soft mt-1">{s.notes}</div>}
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button onClick={() => toggleActive(s)}>
                  <span
                    className={`data-label px-2.5 py-1 rounded-[var(--radius-chip)] font-bold ${
                      s.active ? "bg-cyan-tint text-cyan" : "bg-ground-raised-2 text-text-faint"
                    }`}
                  >
                    {s.active ? "Activa" : "Pausada"}
                  </span>
                </button>
                <button onClick={() => remove(s.id)} className="text-text-faint hover:text-red">
                  <IconClose size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
