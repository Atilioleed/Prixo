"use client";

import { signOut, useSession } from "next-auth/react";
import { IconLogout } from "@/components/icons/Icon";

export default function UserMenu() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  const label = session.user.name ?? session.user.email ?? "Cuenta";

  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-ground-raised-2 border border-line flex items-center justify-center text-xs font-bold text-cyan shrink-0 tabular">
        {label[0]?.toUpperCase()}
      </div>
      <div className="hidden sm:block text-xs text-text-soft max-w-[140px] truncate">{label}</div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-1.5 text-xs font-semibold text-text-soft hover:text-text border border-line rounded-[8px] px-3 py-1.5"
      >
        <IconLogout size={13} strokeWidth={1.8} />
        Salir
      </button>
    </div>
  );
}
