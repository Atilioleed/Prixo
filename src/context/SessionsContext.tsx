"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface SessionEntry {
  id: string;
  type: "practice" | "review" | "video";
  label: string;
  timestamp: string;
}

interface Ctx {
  sessions: SessionEntry[];
  logSession: (type: SessionEntry["type"], label: string) => void;
}

const SessionsContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "prixo-sessions";
const MAX_SESSIONS = 30;

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-shot hydration from localStorage on mount, not a state sync loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSessions(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const logSession: Ctx["logSession"] = (type, label) => {
    setSessions((prev) => {
      const next = [
        { id: crypto.randomUUID(), type, label, timestamp: new Date().toISOString() },
        ...prev,
      ].slice(0, MAX_SESSIONS);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  };

  return (
    <SessionsContext.Provider value={{ sessions, logSession }}>{children}</SessionsContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) throw new Error("useSessions must be used within SessionsProvider");
  return ctx;
}
