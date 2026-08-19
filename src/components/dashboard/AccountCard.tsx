"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTutorProfile } from "@/context/TutorProfileContext";

export default function AccountCard() {
  const { data: session } = useSession();
  const { profile, update } = useTutorProfile();
  const [name, setName] = useState(profile.displayName || session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    update({ displayName: name });
    setSavedMsg("Nombre de usuario actualizado.");
    setTimeout(() => setSavedMsg(null), 2500);
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassword("");
    setSavedMsg("Contraseña actualizada (demo — no hay backend de usuarios todavía).");
    setTimeout(() => setSavedMsg(null), 3500);
  }

  return (
    <div className="panel p-5">
      <div className="data-label text-amber mb-3.5">Mi cuenta</div>

      <div className="data-label mb-1">Correo</div>
      <div className="text-sm text-text-soft mb-4">{session?.user?.email ?? "—"}</div>

      <form onSubmit={saveName} className="flex flex-col gap-2 mb-4">
        <label className="data-label">Nombre de usuario</label>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-line rounded-[8px] px-3.5 py-2.5 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text"
          />
          <button
            type="submit"
            className="border-none px-4 rounded-[8px] bg-ground-raised-2 border border-line text-text font-semibold text-[13px] hover:border-line-bright"
          >
            Guardar
          </button>
        </div>
      </form>

      <form onSubmit={savePassword} className="flex flex-col gap-2">
        <label className="data-label">Nueva contraseña</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="flex-1 border border-line rounded-[8px] px-3.5 py-2.5 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text placeholder:text-text-faint"
          />
          <button
            type="submit"
            disabled={!password}
            className="border border-line px-4 rounded-[8px] bg-ground-raised-2 text-text font-semibold text-[13px] disabled:opacity-40"
          >
            Cambiar
          </button>
        </div>
      </form>

      {savedMsg && <p className="text-xs text-cyan mt-3">{savedMsg}</p>}
    </div>
  );
}
