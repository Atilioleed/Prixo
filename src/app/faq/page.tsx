import InfoPageLayout from "@/components/InfoPageLayout";
import InfoSection from "@/components/InfoSection";

export const metadata = { title: "Preguntas frecuentes — Prixo" };

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Qué es Prixo?",
    a: "Prixo es una plataforma de aprendizaje de idiomas con un tutor de inteligencia artificial que conversa con vos, te corrige, arma un plan de estudio a partir de tu objetivo real (una entrevista de trabajo, un viaje, una negociación con un proveedor) y te ayuda a agendar y recordar tus clases.",
  },
  {
    q: "¿En qué idiomas puedo practicar?",
    a: "Podés elegir el idioma que estás aprendiendo desde tu perfil. El tutor conversa y corrige en ese idioma, adaptado a tu nivel.",
  },
  {
    q: "¿Necesito hablar por micrófono o puedo escribir?",
    a: "Las dos opciones están disponibles. Podés escribir como en cualquier chat, o activar el modo de voz para hablar y escuchar al tutor en voz alta, usando el reconocimiento de voz del navegador.",
  },
  {
    q: "¿Van a poder enviarme y escuchar audios, como notas de voz?",
    a: "Es la próxima función que vamos a sumar: vas a poder mandar un audio corto y el tutor te va a poder responder con uno, para practicar pronunciación de forma más natural que solo texto. La base (grabar y escuchar audios dentro del chat) no tiene costo adicional. Una evaluación más precisa de tu pronunciación (puntaje de qué tan bien pronunciaste cada palabra) y una voz de IA más natural en la respuesta son mejoras que sí dependen de un proveedor externo pago — lo vas a poder activar cuando decidas invertir en esa mejora, no es obligatorio para usar la función.",
  },
  {
    q: "¿Hay videollamada con el tutor?",
    a: "Todavía no. La videollamada con un tutor o avatar de IA está planeada para una segunda etapa del producto, porque requiere un proveedor especializado de avatares/video con costo propio. Hoy el enfoque está en el chat de texto y voz, que ya cubre la corrección y la práctica conversacional sin ese costo.",
  },
  {
    q: "¿Cómo arma Prixo mi plan de estudio?",
    a: "Le contás tu contexto real (por ejemplo: 'tengo que negociar en inglés con un proveedor en China' o 'me voy de viaje por Europa') y, opcionalmente, una fecha límite. El tutor genera objetivos de corto y largo plazo, hitos y escenarios de práctica (roleplay) relacionados a esa situación concreta.",
  },
  {
    q: "¿Mis datos se guardan en algún lado?",
    a: "Hoy tu perfil, tu plan y tu progreso se guardan localmente en tu navegador. Todavía no hay una base de datos central, así que esa información no se sincroniza entre dispositivos. Más detalle en la Política de Privacidad.",
  },
  {
    q: "¿Puedo agendar clases y recibir recordatorios?",
    a: "Sí, desde tu panel podés elegir día y horario y elegir por qué canal querés que te avisemos (dentro de la app, correo, SMS o WhatsApp). Algunos canales de envío real todavía dependen de conectar un proveedor de mensajería.",
  },
  {
    q: "¿Prixo sirve para chicos?",
    a: "Sí, hay un perfil pensado especialmente para niños de 6 a 12 años, con un tono y contenidos adaptados. Recomendamos que un adulto supervise la cuenta.",
  },
  {
    q: "¿Cuánto cuesta usar Prixo?",
    a: "Todavía estamos definiendo el modelo de precios final. Cuando esté disponible, vas a poder verlo directamente en la aplicación antes de contratar cualquier plan.",
  },
];

export default function FaqPage() {
  return (
    <InfoPageLayout eyebrow="Ayuda" title="Preguntas frecuentes" updated="agosto de 2026">
      {FAQS.map((item, i) => (
        <InfoSection key={i} title={item.q}>
          <p>{item.a}</p>
        </InfoSection>
      ))}

      <div className="panel panel-bracketed p-4 text-[13px] text-text-soft leading-relaxed">
        ¿No encontraste tu respuesta? Escribinos a <span className="text-text">soporte@prixo.app</span>.
      </div>
    </InfoPageLayout>
  );
}
