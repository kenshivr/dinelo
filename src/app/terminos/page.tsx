import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones — DiNelo",
  description: "Las reglas de uso de DiNelo, claras y sin letra chiquita.",
};

// Página legal pública (el proxy la deja pasar sin sesión).
function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="nbs flex flex-col gap-1.5 px-4 py-3.5">
      <h2 className="text-[13.5px] font-black">{titulo}</h2>
      <div className="flex flex-col gap-2 text-xs font-bold leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function TerminosPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
          DiNelo
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          términos y condiciones
        </span>
      </div>

      <Seccion titulo="Qué es DiNelo">
        <p>
          Una app gratuita para registrar tus gastos, ingresos y metas de
          ahorro personales. Al crear una cuenta aceptas estos términos y el{" "}
          <Link href="/privacidad" className="underline">
            aviso de privacidad
          </Link>
          .
        </p>
      </Seccion>

      <Seccion titulo="No es asesoría financiera">
        <p>
          Los totales, gráficas y semáforos se calculan con lo que tú
          registras y son solo informativos. DiNelo no da consejos de
          inversión, crédito ni de ningún tipo: las decisiones sobre tu dinero
          son tuyas.
        </p>
      </Seccion>

      <Seccion titulo="Tu cuenta">
        <p>
          Necesitas ser mayor de 18 años, usar un correo real y cuidar tu
          contraseña — lo que pase dentro de tu cuenta es tu responsabilidad.
        </p>
      </Seccion>

      <Seccion titulo="Uso aceptable">
        <p>
          No intentes acceder a datos de otras personas, saturar el servicio
          con cargas automatizadas ni usar la app para algo ilegal. Podemos
          suspender cuentas que abusen del servicio.
        </p>
      </Seccion>

      <Seccion titulo="Disponibilidad">
        <p>
          DiNelo se ofrece «tal cual», sin garantía de estar disponible todo
          el tiempo: puede haber mantenimientos, fallas o cambios en las
          funciones.
        </p>
      </Seccion>

      <Seccion titulo="Responsabilidad">
        <p>
          Hasta donde la ley lo permite, DiNelo no responde por decisiones que
          tomes con base en la app ni por daños indirectos derivados de
          usarla o de no poder usarla.
        </p>
      </Seccion>

      <Seccion titulo="Propiedad">
        <p>
          El código de DiNelo es open source bajo licencia MIT. El nombre, el
          diseño y el personaje son de su autor.
        </p>
      </Seccion>

      <Seccion titulo="Fin del servicio">
        <p>
          Puedes irte cuando quieras: «Eliminar cuenta» borra todos tus datos
          al instante. Si algún día el servicio cerrara, se avisará con
          anticipación razonable para que nadie pierda nada sin saberlo.
        </p>
      </Seccion>

      <Seccion titulo="Ley aplicable y contacto">
        <p>
          Estos términos se rigen por las leyes de México. Dudas:{" "}
          <a href="mailto:vidal.fullstack@gmail.com" className="underline">
            vidal.fullstack@gmail.com
          </a>
          .
        </p>
      </Seccion>

      <span className="text-center text-[10.5px] font-bold text-muted-foreground">
        Última actualización: 1 de septiembre de 2026 ·{" "}
        <Link href="/privacidad" className="underline">
          Aviso de privacidad
        </Link>
      </span>

      <Link
        href="/login"
        className="mt-auto text-center text-xs font-bold text-muted-foreground"
      >
        ‹ Volver al login
      </Link>
    </main>
  );
}
