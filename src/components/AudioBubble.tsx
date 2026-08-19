"use client";

import { useRef, useState } from "react";
import { IconPlay, IconPause } from "@/components/icons/Icon";

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioBubble({
  url,
  duration,
  tone,
}: {
  url: string;
  duration: number;
  tone: "me" | "ai";
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else audio.play();
  }

  const isMe = tone === "me";

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] min-w-[160px] ${
        isMe
          ? "bg-amber text-[#1a1400] self-end rounded-br-[3px]"
          : "bg-ground-raised-2 border border-line text-text self-start rounded-bl-[3px]"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-none ${
          isMe ? "bg-[#1a1400]/15" : "bg-ground-raised"
        }`}
      >
        {playing ? <IconPause size={12} strokeWidth={2} /> : <IconPlay size={12} strokeWidth={2} />}
      </button>
      <div className={`flex-1 h-[3px] rounded-full ${isMe ? "bg-[#1a1400]/20" : "bg-line-bright"}`} />
      <span className="tabular text-[11px] shrink-0">{formatDuration(duration)}</span>
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
