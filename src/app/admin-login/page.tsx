"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconKey, IconLock } from "@/components/icons/Icon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signIn("admin-login", { username, password, redirect: false });
    setSubmitting(false);
    if (res?.error) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    router.push("/app?tab=admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ground px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <IconLock size={16} className="text-amber" />
          <span className="data-label text-amber">Acceso privado</span>
        </div>

        <div className="panel panel-bracketed p-7">
          <h1 className="font-display text-xl font-bold mb-1 text-text text-center">Panel administrativo</h1>
          <p className="text-[12.5px] text-text-soft text-center mb-6">
            Esta puerta es solo para el equipo de Prixo.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="data-label block mb-1.5">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full border border-line rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text placeholder:text-text-faint"
              />
            </div>
            <div>
              <label className="data-label block mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-line rounded-[10px] px-3.5 py-2.5 text-sm outline-none focus:border-amber bg-ground-raised-2 text-text placeholder:text-text-faint"
              />
            </div>

            {error && <p className="text-xs text-red">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="lift glow-amber w-full border-none rounded-[10px] px-4 py-3 font-semibold text-sm bg-amber text-[#1a1400] disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              <IconKey size={14} />
              {submitting ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-text-faint text-center mt-5">
          ¿Eres alumno? <a href="/login" className="text-cyan hover:text-text">Vuelve al acceso normal</a>.
        </p>
      </div>
    </div>
  );
}
