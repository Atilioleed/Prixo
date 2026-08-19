"use client";

import { IconVideo } from "@/components/icons/Icon";

export default function VideoCallModal({
  open,
  onClose,
  tutorName,
}: {
  open: boolean;
  onClose: () => void;
  tutorName: string;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5"
      onClick={onClose}
    >
      <div
        className="panel panel-bracketed max-w-[420px] w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-3">
          <IconVideo size={16} className="text-red" />
          <div className="data-label text-red">Pendiente de integración</div>
        </div>
        <h3 className="font-display text-xl font-bold mb-2.5 text-text">
          Videollamada con {tutorName}
        </h3>
        <p className="text-sm text-text-soft leading-relaxed mb-4">
          Esta pantalla es un marcador de posición. Un avatar con voz y rostro humano en
          tiempo real requiere contratar un proveedor externo de video-IA (por ejemplo
          HeyGen, D-ID o Tavus), con su propia cuenta, costos por minuto y clave de API —
          es una decisión de producto y presupuesto que te corresponde a ti, no algo que
          pueda elegir o activar por mi cuenta.
        </p>
        <p className="text-sm text-text-soft leading-relaxed mb-5">
          Cuando definas el proveedor, esta pantalla se conecta al mismo endpoint de chat
          que ya funciona (mismo tutor, mismo contexto) y solo se le suma el streaming de
          audio/video de ese servicio.
        </p>
        <button
          onClick={onClose}
          className="w-full border-none px-3.5 py-3 rounded-[10px] bg-amber text-[#1a1400] font-semibold text-sm"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
