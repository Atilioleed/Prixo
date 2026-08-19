import InfoPageLayout from "@/components/InfoPageLayout";
import InfoSection from "@/components/InfoSection";

export const metadata = { title: "Términos y Condiciones — Prixo" };

export default function TermsPage() {
  return (
    <InfoPageLayout eyebrow="Legal" title="Términos y Condiciones" updated="agosto de 2026">
      <div className="panel panel-bracketed p-4 text-[13px] text-text-soft leading-relaxed">
        <strong className="text-text">Borrador de referencia.</strong> Al igual que la política
        de privacidad, este texto es una plantilla de partida pensada para que el producto
        tenga algo razonable desde el día uno. Antes de operar comercialmente conviene que un
        abogado lo revise y lo ajuste a tu país y a tu modelo de precios final.
      </div>

      <InfoSection title="1. Aceptación de los términos">
        <p>
          Al crear una cuenta o usar Prixo aceptás estos términos. Si no estás de acuerdo, no
          uses la aplicación. Si creás o administrás una cuenta para un menor de edad, aceptás
          estos términos en su nombre y sos responsable de su uso.
        </p>
      </InfoSection>

      <InfoSection title="2. Qué es Prixo">
        <p>
          Prixo es una plataforma de aprendizaje de idiomas asistida por inteligencia
          artificial: tutor de chat con corrección, práctica de voz, planificación de
          objetivos, seguimiento de progreso y agendamiento de clases. No reemplaza una
          certificación oficial de idioma ni garantiza un resultado específico de aprendizaje.
        </p>
      </InfoSection>

      <InfoSection title="3. Tu cuenta">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Sos responsable de mantener la confidencialidad de tu acceso.</li>
          <li>La información que nos das (nombre, correo, perfil) debe ser real y estar actualizada.</li>
          <li>Podemos suspender cuentas que violen estos términos o que usen la plataforma de forma abusiva.</li>
        </ul>
      </InfoSection>

      <InfoSection title="4. Uso aceptable">
        <p>No está permitido usar Prixo para:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li>Generar contenido ilegal, de odio, o que dañe a terceros.</li>
          <li>Intentar vulnerar la seguridad de la plataforma o acceder a cuentas ajenas.</li>
          <li>Revender o redistribuir el servicio sin autorización.</li>
          <li>Usar el tutor de IA para fines fuera del aprendizaje de idiomas de forma que sobrecargue el servicio.</li>
        </ul>
      </InfoSection>

      <InfoSection title="5. Contenido generado por IA">
        <p>
          Las respuestas del tutor, correcciones, planes de estudio y evaluaciones son
          generadas por un modelo de inteligencia artificial y pueden contener errores.
          Prixo no garantiza que el contenido sea 100% preciso; te recomendamos usar tu
          criterio, especialmente en contextos formales o de alto impacto (por ejemplo, una
          negociación real o una entrevista de trabajo).
        </p>
      </InfoSection>

      <InfoSection title="6. Clases y agendamiento">
        <p>
          Las funciones de agendamiento y recordatorios te ayudan a organizar tu práctica.
          Cancelaciones y reprogramaciones se manejan dentro de la aplicación. Si en el futuro
          se ofrecen clases con tutores humanos, se agregarán términos específicos para esa
          función.
        </p>
      </InfoSection>

      <InfoSection title="7. Planes y pagos">
        <p>
          Los precios y planes vigentes se muestran en la aplicación al momento de la
          contratación. Si activamos cobros, vas a poder ver el detalle y cancelar cuando
          quieras desde tu cuenta. Esta sección se va a completar cuando definamos el modelo
          de precios final.
        </p>
      </InfoSection>

      <InfoSection title="8. Propiedad intelectual">
        <p>
          El diseño, la marca Prixo y el software de la plataforma nos pertenecen. El
          contenido que vos generás en tus conversaciones (tus mensajes, tu progreso) es tuyo;
          nos das permiso para procesarlo únicamente para brindarte el servicio.
        </p>
      </InfoSection>

      <InfoSection title="9. Límite de responsabilidad">
        <p>
          Prixo se ofrece &ldquo;tal cual&rdquo;. En la medida permitida por la ley, no somos
          responsables por daños indirectos derivados del uso de la plataforma, incluyendo
          decisiones tomadas en base a contenido generado por IA.
        </p>
      </InfoSection>

      <InfoSection title="10. Cambios a estos términos">
        <p>
          Podemos actualizar estos términos con el tiempo. Los cambios importantes se van a
          avisar dentro de la aplicación antes de entrar en vigencia.
        </p>
      </InfoSection>

      <InfoSection title="11. Contacto">
        <p>Para consultas sobre estos términos, escribinos a soporte@prixo.app.</p>
      </InfoSection>
    </InfoPageLayout>
  );
}
