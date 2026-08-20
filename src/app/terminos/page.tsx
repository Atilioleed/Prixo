import Link from "next/link";
import type { Metadata } from "next";
import InfoPageLayout from "@/components/InfoPageLayout";
import InfoSection from "@/components/InfoSection";
import TLDR from "@/components/TLDR";

export const metadata: Metadata = {
  title: "Reglas de uso de la plataforma",
  description:
    "Términos y condiciones de Prixo: qué puedes esperar del tutor de IA, tus responsabilidades como usuario, y las reglas sobre cuentas, contenido generado por IA y planes.",
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  return (
    <InfoPageLayout eyebrow="Legal" title="Términos y Condiciones" updated="agosto de 2026">
      <div className="panel panel-bracketed p-4 text-[13px] text-text-soft leading-relaxed">
        <strong className="text-text">Borrador de referencia.</strong> Al igual que la política
        de privacidad, este texto es una plantilla de partida pensada para que el producto
        tenga algo razonable desde el día uno. Antes de operar comercialmente conviene que un
        abogado lo revise y lo ajuste a tu país y a tu modelo de precios final.
      </div>

      <TLDR
        items={[
          "El tutor de IA puede equivocarse — usa tu criterio en contextos formales o de alto impacto.",
          "Eres responsable de la confidencialidad de tu cuenta y de la información que nos das.",
          "Mientras tu cuenta esté activa, puedes crear todos los planes de estudio que quieras.",
          "El diseño y la marca son de Prixo; tus conversaciones y tu progreso son tuyos.",
        ]}
      />

      <Link
        href="/login"
        className="lift glow-amber inline-block w-fit border-none px-5 py-2.5 rounded-[10px] bg-amber text-[#1a1400] font-bold text-[13.5px]"
      >
        Crear mi cuenta →
      </Link>

      <InfoSection title="1. Aceptación de los términos">
        <p>
          Al crear una cuenta o usar Prixo aceptas estos términos. Si no estás de acuerdo, no
          uses la aplicación. Si creas o administras una cuenta para un menor de edad, aceptas
          estos términos en su nombre y eres responsable de su uso.
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
          <li>Eres responsable de mantener la confidencialidad de tu acceso.</li>
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

      <InfoSection title="7. Planes de suscripción y planes de estudio">
        <p>
          Estos son dos cosas distintas. Tu <strong className="text-text">plan de
          suscripción</strong> es el contrato comercial: los precios y planes vigentes se
          muestran en la aplicación al momento de la contratación, y si activamos cobros vas a
          poder ver el detalle y cancelar cuando quieras desde tu cuenta.
        </p>
        <p>
          Tu <strong className="text-text">plan de estudio</strong> es el que la IA arma para
          ti según tu objetivo (un viaje, una negociación, un examen). Mientras tu
          suscripción esté vigente, puedes crear todos los planes de estudio que necesites —
          uno por cada objetivo distinto que quieras trabajar — sin límite adicional.
        </p>
      </InfoSection>

      <InfoSection title="8. Propiedad intelectual">
        <p>
          El diseño, la marca Prixo y el software de la plataforma nos pertenecen. El
          contenido que tú generas en tus conversaciones (tus mensajes, tu progreso) es tuyo;
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

      <div className="pt-2 border-t border-line flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-semibold">
        <Link href="/privacidad" className="text-cyan hover:text-text">
          Política de Privacidad
        </Link>
        <Link href="/faq" className="text-cyan hover:text-text">
          Preguntas frecuentes
        </Link>
      </div>
    </InfoPageLayout>
  );
}
