"use client";

import { useEffect, useRef, useState } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import Note from "@/components/Note";
import ScreenHead from "@/components/ScreenHead";
import Stage from "@/components/Stage";
import VideoCallModal from "@/components/VideoCallModal";
import AudioBubble from "@/components/AudioBubble";
import { useTutorProfile } from "@/context/TutorProfileContext";
import { usePlan } from "@/context/PlanContext";
import { useSessions } from "@/context/SessionsContext";
import { useVoice } from "@/hooks/useVoice";
import { useAudioRecorder, type RecordedAudio } from "@/hooks/useAudioRecorder";
import { langCodeFor } from "@/lib/languageCodes";
import { IconVideo, IconMic, IconPlay } from "@/components/icons/Icon";

interface Correction {
  wrong: string;
  right: string;
}

interface Bubble {
  role: "ai" | "me";
  text: string;
  correction?: Correction | null;
  audio?: RecordedAudio;
}

type ChatMode = "practice" | "review";

function greetingFor(mode: ChatMode, avatarName: string, targetLanguage: string): Bubble {
  return mode === "practice"
    ? {
        role: "ai",
        text: `Hi! I'm ${avatarName}, your ${targetLanguage} tutor. What did you do last weekend?`,
      }
    : {
        role: "ai",
        text: `Hola, soy ${avatarName}. ¿Cómo sentiste que te fue practicando esta semana? Cuéntame qué te costó más.`,
      };
}

export default function Chat() {
  const { profile } = useTutorProfile();
  const { activePlan } = usePlan();
  const { logSession } = useSessions();
  const langCode = langCodeFor(profile.targetLanguage);
  const { supported: voiceSupported, listening, listen, stopListening, speak } = useVoice(langCode);
  const recorder = useAudioRecorder();

  const [mode, setMode] = useState<ChatMode>("practice");
  const [bubbles, setBubbles] = useState<Bubble[]>([
    greetingFor("practice", profile.avatarName, profile.targetLanguage),
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logSession("practice", `Sesión de práctica con ${profile.avatarName}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchMode(next: ChatMode) {
    if (next === mode) return;
    setMode(next);
    setBubbles([greetingFor(next, profile.avatarName, profile.targetLanguage)]);
    setError(null);
    logSession(
      next,
      next === "practice"
        ? `Sesión de práctica con ${profile.avatarName}`
        : `Revisión de avance con ${profile.avatarName}`
    );
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles]);

  async function sendMessage(text: string, viaVoice: boolean, audio?: RecordedAudio) {
    if (!text.trim() || sending) return;
    setError(null);
    const nextBubbles: Bubble[] = [...bubbles, { role: "me", text, audio }];
    setBubbles(nextBubbles);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          mode,
          plan: activePlan,
          messages: nextBubbles.map((b) => ({
            role: b.role === "me" ? "user" : "assistant",
            content: b.text,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al hablar con la IA.");
        return;
      }
      setBubbles((prev) => [
        ...prev,
        { role: "ai", text: data.reply, correction: data.correction },
      ]);
      if (viaVoice) speak(data.reply as string);
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está corriendo `npm run dev`?");
    } finally {
      setSending(false);
    }
  }

  async function handleMic() {
    if (listening) {
      stopListening();
      if (recorder.recording) await recorder.stop();
      return;
    }
    setError(null);
    try {
      await recorder.start();
    } catch {
      // Mic permission denied for the raw recording — speech-to-text can still work on its own.
    }
    listen(async (transcript) => {
      const audio = recorder.recording ? await recorder.stop() : null;
      sendMessage(transcript, true, audio ?? undefined);
    });
  }

  return (
    <>
      <ScreenHead
        title="Chatear con la IA"
        description="Conversación de texto o voz, con correcciones en línea sin interrumpir el hilo. Desde aquí el alumno puede saltar directo a videollamada con el mismo tutor."
      />
      <div className="flex gap-1 bg-ground-raised border border-line rounded-[10px] p-1 w-fit mb-5">
        <button
          onClick={() => switchMode("practice")}
          className={`px-4 py-2 rounded-[7px] font-semibold text-[12.5px] transition-colors ${
            mode === "practice" ? "bg-amber text-[#1a1400]" : "text-text-soft hover:text-text"
          }`}
        >
          Practicar
        </button>
        <button
          onClick={() => switchMode("review")}
          className={`px-4 py-2 rounded-[7px] font-semibold text-[12.5px] transition-colors ${
            mode === "review" ? "bg-amber text-[#1a1400]" : "text-text-soft hover:text-text"
          }`}
        >
          Revisar mi avance
        </button>
      </div>
      <Stage
        phone={
          <PhoneFrame>
            <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-line">
              <div className="w-[38px] h-[38px] rounded-full p-0.5 bg-[conic-gradient(from_0deg,var(--seal-violet),var(--seal-lime))]">
                <div className="w-full h-full rounded-full bg-ground-raised-2 flex items-center justify-center text-text font-bold text-sm">
                  {profile.avatarName[0]}
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm text-text">{profile.avatarName} — tu tutor</div>
                <div className="data-label text-cyan flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-dot" /> En línea
                </div>
              </div>
              <div className="ml-auto">
                <button
                  title="Iniciar videollamada"
                  onClick={() => {
                    setVideoOpen(true);
                    logSession("video", `Videollamada con ${profile.avatarName}`);
                  }}
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center border-none bg-amber text-[#1a1400]"
                >
                  <IconVideo size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex-1 px-4 pt-4 pb-1.5 flex flex-col gap-2.5 overflow-y-auto"
            >
              {bubbles.map((b, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 max-w-[82%] ${
                    b.role === "ai" ? "items-start self-start" : "items-end self-end"
                  }`}
                >
                  {b.audio ? (
                    <AudioBubble url={b.audio.url} duration={b.audio.duration} tone={b.role === "ai" ? "ai" : "me"} />
                  ) : (
                    <div
                      className={`px-[13px] py-2.5 rounded-[10px] text-[13.5px] leading-[1.45] ${
                        b.role === "ai"
                          ? "bg-ground-raised-2 border border-line rounded-bl-[3px] text-text"
                          : "bg-amber text-[#1a1400] rounded-br-[3px] font-medium"
                      }`}
                    >
                      {b.text}
                    </div>
                  )}
                  {b.audio && (
                    <div
                      className={`px-1 text-[11.5px] leading-snug text-text-faint ${
                        b.role === "ai" ? "text-left" : "text-right"
                      }`}
                    >
                      {b.role === "me" ? "Se entendió: " : ""}
                      {b.text}
                    </div>
                  )}
                  {b.role === "ai" && !b.audio && (
                    <button
                      type="button"
                      onClick={() => speak(b.text)}
                      title="Escuchar en voz alta"
                      className="flex items-center gap-1 px-1 text-[11px] font-semibold text-text-faint hover:text-cyan disabled:opacity-30"
                      disabled={!voiceSupported}
                    >
                      <IconPlay size={10} strokeWidth={2} /> Reproducir
                    </button>
                  )}
                  {b.correction && (
                    <div className="px-[13px] py-2.5 rounded-[10px] text-[12.5px] leading-[1.45] bg-cyan-tint border border-cyan-dim/40 text-cyan">
                      Dijiste &quot;{b.correction.wrong}
                      &quot;, la forma correcta es <b className="text-text">{b.correction.right}</b>.
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="max-w-[82%] px-[13px] py-2.5 rounded-[10px] text-[13.5px] bg-ground-raised-2 border border-line self-start text-text-faint">
                  {profile.avatarName} está escribiendo…
                </div>
              )}
              {error && (
                <div className="max-w-[95%] px-[13px] py-2.5 rounded-[10px] text-[12px] bg-red-tint border border-red/30 text-red self-start">
                  {error}
                </div>
              )}
            </div>
            {(listening || recorder.recording) && (
              <div className="flex items-center gap-1.5 px-4 pt-2 data-label text-red">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse-dot" />
                Grabando… {recorder.seconds}s
              </div>
            )}
            <form
              className="flex items-center gap-2 px-4 pt-3 pb-[18px] border-t border-line"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input, false);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu respuesta…"
                className="flex-1 bg-ground-raised-2 border border-line rounded-[var(--radius-chip)] px-3.5 py-2.5 text-[13px] outline-none text-text placeholder:text-text-faint focus:border-line-bright"
              />
              <button
                type="button"
                onClick={handleMic}
                title={
                  voiceSupported
                    ? "Mandar una nota de voz — se graba tu audio real y se transcribe para la corrección"
                    : "Reconocimiento de voz no disponible en este navegador"
                }
                disabled={!voiceSupported}
                className={`w-[38px] h-[38px] rounded-full flex items-center justify-center border-none shrink-0 disabled:opacity-40 ${
                  listening ? "bg-red text-white" : "bg-ground-raised-2 border border-line text-text"
                }`}
              >
                <IconMic size={15} strokeWidth={1.8} />
              </button>
            </form>
          </PhoneFrame>
        }
        notes={
          <>
            <Note label="Corrección sin fricción">
              Los errores se marcan como una burbuja aparte, breve y en español (según la
              lengua materna elegida), sin cortar el ritmo de la conversación — el punto
              débil que más se critica en apps como Praktika.
            </Note>
            <Note label="Texto o notas de voz">
              {voiceSupported
                ? "El micrófono graba tu audio real (se escucha como nota de voz, igual que en WhatsApp) y en paralelo lo transcribe para que la IA te corrija. Cada respuesta de la IA tiene un botón para reproducirla en voz alta."
                : "Tu navegador no soporta reconocimiento de voz nativo — prueba en Chrome de escritorio o Android para el modo voz."}
            </Note>
            <Note label="Evaluación de pronunciación">
              Hoy la corrección se basa en lo que la IA entiende del texto transcripto. Un
              puntaje de pronunciación palabra por palabra necesitaría un servicio pago
              (por ejemplo, Azure Speech) — queda disponible para activar más adelante.
            </Note>
            <Note label="Botón de videollamada">
              Un toque para pasar del chat de texto a una llamada cara a cara con el mismo
              tutor — memoria de la conversación compartida entre ambos modos.
            </Note>
          </>
        }
      />
      <VideoCallModal open={videoOpen} onClose={() => setVideoOpen(false)} tutorName={profile.avatarName} />
    </>
  );
}
