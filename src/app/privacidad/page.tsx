import Link from "next/link";
import type { Metadata } from "next";
import InfoPageLayout from "@/components/InfoPageLayout";
import InfoSection from "@/components/InfoSection";
import TLDR from "@/components/TLDR";

export const metadata: Metadata = {
  title: "Cómo cuidamos tus datos",
  description:
    "Qué datos recopila Prixo, cómo se usan, con quién se comparten y qué derechos tienes sobre tu información — incluyendo el cuidado extra para cuentas de menores.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return (
    <InfoPageLayout eyebrow="Legal" title="Política de Privacidad" updated="agosto de 2026">
      <div className="panel panel-bracketed p-4 text-[13px] text-text-soft leading-relaxed">
        <strong className="text-text">Borrador de referencia.</strong> Este documento es una plantilla
        de partida, no un texto revisado por un abogado. Antes de lanzar Prixo públicamente —
        y en especial porque uno de los perfiles son niños de 6 a 12 años — conviene que un
        abogado la revise según las leyes de protección de datos de tu país (y las de EE.UU./UE
        si vas a tener usuarios ahí, por regulaciones como COPPA o GDPR sobre datos de menores).
      </div>

      <TLDR
        items={[
          "Hoy tus datos viven en el navegador (localStorage), no en un servidor central.",
          "El contenido de tus chats se envía al proveedor de IA que responde en cada mensaje, nunca se vende a terceros.",
          "Puedes pedir acceso, corrección o borrado de tus datos cuando quieras.",
          "Hay cuidado extra declarado para cuentas de menores de edad.",
        ]}
      />

      <Link
        href="/login"
        className="lift glow-amber inline-block w-fit border-none px-5 py-2.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[13.5px]"
      >
        Crear mi cuenta →
      </Link>

      <InfoSection title="1. Qué datos recopilamos">
        <p>Según cómo uses Prixo, podemos recopilar:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Datos de cuenta: nombre, correo electrónico, y si inicias sesión con Google, la información básica de perfil que ese servicio comparte.</li>
          <li>Datos de aprendizaje: el idioma que eliges, tu perfil (niño, joven, profesional, etc.), tu plan de estudio, tu progreso, y el contenido de tus conversaciones con el tutor de IA.</li>
          <li>Grabaciones de voz, si usas el modo de voz o mensajes de audio, para transcribirlas y darte corrección.</li>
          <li>Datos técnicos básicos: tipo de dispositivo y navegador, para que la aplicación funcione correctamente.</li>
        </ul>
      </InfoSection>

      <InfoSection title="2. Dónde viven tus datos hoy">
        <p>
          En esta versión del producto (MVP), la mayoría de tus datos —tu perfil, tu plan, tu
          progreso, tus clases agendadas— se guardan únicamente en el almacenamiento local de
          tu propio navegador, no en un servidor. Esto significa que hoy nadie más que tú
          accede a esos datos, pero también que no se sincronizan entre dispositivos y se
          pierden si borras los datos del navegador. Cuando sumemos una base de datos real,
          esta sección se va a actualizar para reflejarlo.
        </p>
      </InfoSection>

      <InfoSection title="3. Cómo usamos tus datos">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Para que el tutor de IA genere respuestas, correcciones y planes de estudio a tu medida.</li>
          <li>Para mostrarte tu progreso, tu racha y tus recordatorios.</li>
          <li>Para enviarte recordatorios de clases, si activas esa función y eliges un canal (correo, SMS, WhatsApp, notificaciones).</li>
          <li>Para mejorar el producto — nunca para venderlos a terceros con fines publicitarios.</li>
        </ul>
      </InfoSection>

      <InfoSection title="4. Con quién compartimos datos">
        <p>
          El contenido de tus conversaciones se envía al proveedor de inteligencia artificial
          que responda en ese momento (por ejemplo Google, Groq, Anthropic, OpenRouter u
          OpenAI — Prixo usa varios y pasa al siguiente si uno falla) para generar las
          respuestas del tutor, bajo los términos de privacidad de ese proveedor. Si activas
          recordatorios por correo, SMS o WhatsApp, el contacto necesario se comparte con el
          proveedor de mensajería correspondiente únicamente para ese fin. No compartimos tus
          datos con nadie más sin tu consentimiento, salvo que la ley lo exija.
        </p>
      </InfoSection>

      <InfoSection title="5. Menores de edad">
        <p>
          Prixo ofrece un perfil pensado para niños de 6 a 12 años. Si eres madre, padre o
          tutor y creas o supervisas una cuenta familiar para un menor, entiendes que eres
          responsable de esa cuenta. No recopilamos intencionalmente más datos de un menor
          que los necesarios para el servicio educativo. Si crees que un menor usó Prixo sin
          tu consentimiento, contáctanos para eliminar esa información. Más sobre cómo
          funcionan los perfiles familiares en las{" "}
          <Link href="/faq" className="text-cyan hover:text-text">
            preguntas frecuentes
          </Link>
          .
        </p>
      </InfoSection>

      <InfoSection title="6. Tus derechos">
        <p>Puedes pedirnos en cualquier momento:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Acceder a los datos que tenemos sobre ti.</li>
          <li>Corregir información incorrecta.</li>
          <li>Eliminar tu cuenta y tus datos.</li>
          <li>Exportar tus datos en un formato legible.</li>
        </ul>
      </InfoSection>

      <InfoSection title="7. Seguridad">
        <p>
          Usamos prácticas estándar de la industria para proteger tu información (conexiones
          cifradas, control de acceso a las cuentas de administrador). Ningún sistema es
          perfectamente seguro; si detectamos un incidente que afecte tus datos, te vamos a
          avisar según lo exija la ley.
        </p>
      </InfoSection>

      <InfoSection title="8. Cambios a esta política">
        <p>
          Si actualizamos esta política de forma importante, te lo vamos a notificar dentro
          de la aplicación antes de que el cambio entre en vigencia.
        </p>
      </InfoSection>

      <InfoSection title="9. Contacto">
        <p>Para cualquier consulta sobre privacidad, escribinos a soporte@prixo.app.</p>
      </InfoSection>

      <div className="pt-2 border-t border-line flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-semibold">
        <Link href="/terminos" className="text-cyan hover:text-text">
          Términos y Condiciones
        </Link>
        <Link href="/faq" className="text-cyan hover:text-text">
          Preguntas frecuentes
        </Link>
      </div>
    </InfoPageLayout>
  );
}
