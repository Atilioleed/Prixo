"use client";

import { useState } from "react";
import { IconSend, IconCheck } from "@/components/icons/Icon";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: "Prixo — Tu idioma, un paso a la vez.",
      text: "Un tutor de idiomas con IA que se prepara para tu viaje, tu negociación o tu entrevista real.",
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled the native share sheet — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing else we can do silently
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      title="Compartir"
      className="lift border border-line w-9 h-9 rounded-[8px] flex items-center justify-center text-text-soft hover:text-text hover:border-line-bright shrink-0"
    >
      {copied ? <IconCheck size={14} className="text-cyan" strokeWidth={2.5} /> : <IconSend size={14} />}
    </button>
  );
}
