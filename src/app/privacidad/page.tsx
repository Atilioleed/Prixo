import InfoPageLayout from "@/components/InfoPageLayout";
import InfoSection from "@/components/InfoSection";

export const metadata = { title: "Política de Privacidad — Prixo" };

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

      <InfoSection title="1. Qué datos recopilamos">
        <p>Según cómo uses Prixo, podemos recopilar:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Datos de cuenta: nombre, correo electrónico, y si iniciás sesión con Google, la información básica de perfil que ese servicio comparte.</li>
          <li>Datos de aprendizaje: el idioma que elegís, tu perfil (niño, joven, profesional, etc.), tu plan de estudio, tu progreso, y el contenido de tus conversaciones con el tutor de IA.</li>
          <li>Grabaciones de voz, si usás el modo de voz o mensajes de audio, para transcribirlas y darte corrección.</li>
          <li>Datos técnicos básicos: tipo de dispositivo y navegador, para que la aplicación funcione correctamente.</li>
        </ul>
      </InfoSection>

      <InfoSection title="2. Dónde viven tus datos hoy">
        <p>
          En esta versión del producto (MVP), la mayoría de tus datos —tu perfil, tu plan, tu
          progreso, tus clases agendadas— se guardan únicamente en el almacenamiento local de
          tu propio navegador, no en un servidor. Esto significa que hoy nadie más que vos
          accede a esos datos, pero también que no se sincronizan entre dispositivos y se
          pierden si borrás los datos del navegador. Cuando sumemos una base de datos real,
          esta sección se va a actualizar para reflejarlo.
        </p>
      </InfoSection>

      <InfoSection title="3. Cómo usamos tus datos">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Para que el tutor de IA genere respuestas, correcciones y planes de estudio a tu medida.</li>
          <li>Para mostrarte tu progreso, tu racha y tus recordatorios.</li>
          <li>Para enviarte recordatorios de clases, si activás esa función y elegís un canal (correo, SMS, WhatsApp, notificaciones).</li>
          <li>Para mejorar el producto — nunca para venderlos a terceros con fines publicitarios.</li>
        </ul>
      </InfoSection>

      <InfoSection title="4. Con quién compartimos datos">
        <p>
          El contenido de tus conversaciones se envía a <strong className="text-text">Anthropic</strong> (el
          proveedor del modelo de IA que usa Prixo) para generar las respuestas del tutor,
          bajo los términos de privacidad de ese proveedor. Si activás recordatorios por
          correo, SMS o WhatsApp, el contacto necesario se comparte con el proveedor de
          mensajería correspondiente únicamente para ese fin. No compartimos tus datos con
          nadie más sin tu consentimiento, salvo que la ley lo exija.
        </p>
      </InfoSection>

      <InfoSection title="5. Menores de edad">
        <p>
          Prixo ofrece un perfil pensado para niños de 6 a 12 años. Si sos madre, padre o
          tutor y creás o supervisás una cuenta familiar para un menor, entendés que sos
          responsable de esa cuenta. No recopilamos intencionalmente más datos de un menor
          que los necesarios para el servicio educativo. Si creés que un menor usó Prixo sin
          tu consentimiento, contactanos para eliminar esa información.
        </p>
      </InfoSection>

      <InfoSection title="6. Tus derechos">
        <p>Podés pedirnos en cualquier momento:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Acceder a los datos que tenemos sobre vos.</li>
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
    </InfoPageLayout>
  );
}
