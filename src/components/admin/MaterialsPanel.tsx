"use client";

import { useEffect, useState } from "react";
import Pill from "@/components/Pill";
import { LANGUAGES } from "@/lib/languageCodes";
import { IconPlus, IconClose } from "@/components/icons/Icon";

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

const EMPTY_DRAFT = { title: "", level: "A1", type: "Vocabulario", language: "Inglés", content: "" };

export default function MaterialsPanel() {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [dbReady, setDbReady] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={!dbReady}
          className="lift glow-amber flex items-center gap-1.5 text-[11.5px] font-bold border-none rounded-[8px] px-3 py-2 bg-amber text-[#1a1400] disabled:opacity-40"
        >
          <IconPlus size={12} /> Nuevo documento
        </button>
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
