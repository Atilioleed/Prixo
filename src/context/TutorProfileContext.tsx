"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_PROFILE, type TutorProfile } from "@/lib/tutorProfile";

// Types/constants/pure helpers now live in src/lib/tutorProfile.ts (a plain
// module, not "use client") so server code can import them too — re-exported
// here so existing client-side imports from this file keep working.
export {
  DEFAULT_PROFILE,
  getStageIndex,
  withStageIndex,
  type TutorProfile,
  type WhoKey,
  type AgeRange,
  type SexOption,
  type LevelKey,
} from "@/lib/tutorProfile";

interface Ctx {
  profile: TutorProfile;
  update: (patch: Partial<TutorProfile>) => void;
  ready: boolean;
}

const TutorProfileContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "prixo-tutor-profile";

export function TutorProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<TutorProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-shot hydration from localStorage on mount, not a state sync loop.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      // ignore malformed storage
    } finally {
      setReady(true);
    }
  }, []);

  const update = (patch: Partial<TutorProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable, keep in-memory only
      }
      return next;
    });
  };

  return (
    <TutorProfileContext.Provider value={{ profile, update, ready }}>
      {children}
    </TutorProfileContext.Provider>
  );
}

export function useTutorProfile() {
  const ctx = useContext(TutorProfileContext);
  if (!ctx) throw new Error("useTutorProfile must be used within TutorProfileProvider");
  return ctx;
}
