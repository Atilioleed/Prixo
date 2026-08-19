"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useIsAdmin() {
  const { status } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    fetch("/api/is-admin")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setIsAdmin(!!data.isAdmin);
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return isAdmin;
}
