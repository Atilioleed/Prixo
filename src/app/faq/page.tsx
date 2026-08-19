import Link from "next/link";
import type { Metadata } from "next";
import InfoPageLayout from "@/components/InfoPageLayout";
import InfoSection from "@/components/InfoSection";
import TLDR from "@/components/TLDR";
import JsonLd from "@/components/JsonLd";
import { LANGUAGES } from "@/lib/languageCodes";

export const metadata: Metadata = {
  title: "Dudas comunes, resueltas",
  description:
    "Respuestas sobre los idiomas que podés practicar en Prixo, notas de voz, videollamada, cuántos planes de estudio podés crear, privacidad de tus datos y precios.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: React.ReactNode; plain: string }[] = [
  {
    q: "¿Qué es Prixo?",
    plain:
      "Prixo es una plataforma de aprendizaje de idiomas con un tutor de inteligencia artificial que conversa con vos, te corrige, arma un plan de estudio a partir de tu objetivo real (una entrevista de trabajo, un viaje, una negociación con un proveedor) y te ayuda a agendar y recordar tus clases.",
    a: "Prixo es una plataforma de aprendizaje de idiomas con un tutor de inteligencia artificial que conversa con vos, te corrige, arma un plan de estudio a partir de tu objetivo real (una entrevista de trabajo, un viaje, una negociación con un proveedor) y te ayuda a agendar y recordar tus clases.",
  },
  {
    q: "¿En qué idiomas puedo practicar?",
    plain:
      "Hoy podés aprender inglés, español, francés, alemán, portugués o italiano — los idiomas donde el tutor de IA rinde a nivel nativo. Elegís el idioma desde tu perfil, y el tutor conversa y corrige en ese idioma, adaptado a tu nivel.",
    a: (
      <>
        <p>
          Hoy podés aprender inglés, español, francés, alemán, portugués o italiano — los
          idiomas donde el tutor de IA rinde a nivel nativo. Elegís el idioma desde tu perfil, y
          el tutor conversa y corrige en ese idioma, adaptado a tu nivel.
        </p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] uppercase tracking-[0.05em] text-text-faint px-2.5 py-2 border-b-[1.5px] border-line">
                  Idioma
                </th>
                <th className="text-left font-mono text-[10px] uppercase tracking-[0.05em] text-text-faint px-2.5 py-2 border-b-[1.5px] border-line">
                  Bandera
                </th>
              </tr>
            </thead>
            <tbody>
              {LANGUAGES.map((l) => (
                <tr key={l.label}>
                  <td className="px-2.5 py-2 border-b border-line text-text">{l.label}</td>
                  <td className="px-2.5 py-2 border-b border-line text-lg">{l.flag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    q: "¿Necesito hablar por micrófono o puedo escribir?",
    plain:
      "Las dos opciones están disponibles. Podés escribir como en cualquier chat, o usar el micrófono para mandar una nota de voz real (se graba y se escucha, como en WhatsApp) que además se transcribe para que el tutor te corrija. Las respuestas de la IA también se pueden reproducir en voz alta.",
    a: "Las dos opciones están disponibles. Podés escribir como en cualquier chat, o usar el micrófono para mandar una nota de voz real (se graba y se escucha, como en WhatsApp) que además se transcribe para que el tutor te corrija. Las respuestas de la IA también se pueden reproducir en voz alta.",
  },
  {
    q: "¿Cuántos planes de estudio puedo crear?",
    plain:
      "Todos los que quieras, mientras tu cuenta esté activa. Cada plan se arma para un objetivo distinto (un viaje, una negociación, una entrevista) y podés tenerlos todos guardados a la vez, sin límite de cantidad.",
    a: "Todos los que quieras, mientras tu cuenta esté activa. Cada plan se arma para un objetivo distinto (un viaje, una negociación, una entrevista) y podés tenerlos todos guardados a la vez, sin límite de cantidad.",
  },
  {
    q: "¿Hay videollamada con el tutor?",
    plain:
      "Todavía no. La videollamada con un tutor o avatar de IA está planeada para una segunda etapa del producto, porque requiere un proveedor especializado de avatares/video con costo propio. Hoy el enfoque está en el chat de texto y voz, que ya cubre la corrección y la práctica conversacional sin ese costo.",
    a: "Todavía no. La videollamada con un tutor o avatar de IA está planeada para una segunda etapa del producto, porque requiere un proveedor especializado de avatares/video con costo propio. Hoy el enfoque está en el chat de texto y voz, que ya cubre la corrección y la práctica conversacional sin ese costo.",
  },
  {
    q: "¿Cómo arma Prixo mi plan de estudio?",
    plain:
      "Al crear tu cuenta respondés un cuestionario corto (idioma, nivel, objetivo) y hacés un chequeo rápido de vocabulario. Con eso, y con el contexto real que le cuentes (por ejemplo: 'tengo que negociar en inglés con un proveedor en China'), el tutor genera objetivos de corto y largo plazo, hitos y escenarios de práctica (roleplay) para esa situación concreta.",
    a: "Al crear tu cuenta respondés un cuestionario corto (idioma, nivel, objetivo) y hacés un chequeo rápido de vocabulario. Con eso, y con el contexto real que le cuentes (por ejemplo: 'tengo que negociar en inglés con un proveedor en China'), el tutor genera objetivos de corto y largo plazo, hitos y escenarios de práctica (roleplay) para esa situación concreta.",
  },
  {
    q: "¿Mis datos se guardan en algún lado?",
    plain:
      "Hoy tu perfil, tus planes y tu progreso se guardan localmente en tu navegador. Todavía no hay una base de datos central, así que esa información no se sincroniza entre dispositivos. Más detalle en la Política de Privacidad.",
    a: (
      <p>
        Hoy tu perfil, tus planes y tu progreso se guardan localmente en tu navegador. Todavía
        no hay una base de datos central, así que esa información no se sincroniza entre
        dispositivos. Más detalle en la{" "}
        <Link href="/privacidad" className="text-cyan hover:text-text">
          Política de Privacidad
        </Link>
        .
      </p>
    ),
  },
  {
    q: "¿Puedo agendar clases y recibir recordatorios?",
    plain:
      "Sí, desde tu panel podés elegir día y horario y elegir por qué canal querés que te avisemos. El correo ya te manda una confirmación real; WhatsApp, SMS y las notificaciones push todavía dependen de conectar su proveedor.",
    a: "Sí, desde tu panel podés elegir día y horario y elegir por qué canal querés que te avisemos. El correo ya te manda una confirmación real; WhatsApp, SMS y las notificaciones push todavía dependen de conectar su proveedor.",
  },
  {
    q: "¿Prixo sirve para chicos?",
    plain:
      "Sí, hay un perfil pensado especialmente para niños de 6 a 12 años, con un tono y contenidos adaptados. Recomendamos que un adulto supervise la cuenta.",
    a: "Sí, hay un perfil pensado especialmente para niños de 6 a 12 años, con un tono y contenidos adaptados. Recomendamos que un adulto supervise la cuenta.",
  },
  {
    q: "¿Cuánto cuesta usar Prixo?",
    plain:
      "Todavía estamos definiendo el modelo de precios final. Cuando esté disponible, vas a poder verlo directamente en la aplicación antes de contratar cualquier plan.",
    a: "Todavía estamos definiendo el modelo de precios final. Cuando esté disponible, vas a poder verlo directamente en la aplicación antes de contratar cualquier plan.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.plain,
    },
  })),
};

export default function FaqPage() {
  return (
    <InfoPageLayout eyebrow="Ayuda" title="Preguntas frecuentes" updated="agosto de 2026">
      <JsonLd data={FAQ_SCHEMA} />

      <p className="text-[14px] text-text-soft leading-relaxed">
        Esta página responde las dudas más comunes antes de crear una cuenta: qué idiomas
        podés practicar, cómo funciona la voz y las notas de audio, cuántos planes de estudio
        podés tener y qué pasa con tus datos.
      </p>

      <TLDR
        items={[
          "6 idiomas disponibles hoy: inglés, español, francés, alemán, portugués e italiano.",
          "Texto y notas de voz reales funcionan ya — la videollamada llega en la etapa 2.",
          "Podés crear todos los planes de estudio que quieras mientras tu cuenta esté activa.",
          "Tus datos viven en tu navegador hoy — nada se vende a terceros.",
        ]}
      />

      <Link
        href="/login"
        className="lift glow-amber inline-block w-fit border-none px-5 py-2.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[13.5px]"
      >
        Crear mi cuenta →
      </Link>

      {FAQS.map((item, i) => (
        <InfoSection key={i} title={item.q}>
          {item.a}
        </InfoSection>
      ))}

      <div className="panel panel-bracketed p-4 text-[13px] text-text-soft leading-relaxed">
        ¿No encontraste tu respuesta? Escribinos a <span className="text-text">soporte@prixo.app</span>.
      </div>

      <div className="pt-2 border-t border-line flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-semibold">
        <Link href="/privacidad" className="text-cyan hover:text-text">
          Política de Privacidad
        </Link>
        <Link href="/terminos" className="text-cyan hover:text-text">
          Términos y Condiciones
        </Link>
      </div>
    </InfoPageLayout>
  );
}
