import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de privacidad — DiNelo",
  description:
    "Qué datos guarda DiNelo, para qué, quién puede verlos y cómo borrarlos.",
};

// Página legal pública (el proxy la deja pasar sin sesión). Sin tecnicismos:
// dice la verdad de cómo funciona la app y nada más.
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

export default function PrivacidadPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
          DiNelo
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          aviso de privacidad
        </span>
      </div>

      <Seccion titulo="Quién responde por tus datos">
        <p>
          DiNelo la desarrolla y opera su autor de forma independiente. Para
          cualquier tema de privacidad escribe a{" "}
          <a href="mailto:vidal.fullstack@gmail.com" className="underline">
            vidal.fullstack@gmail.com
          </a>
          .
        </p>
      </Seccion>

      <Seccion titulo="Qué datos guardamos">
        <p>
          Tu correo, tu nombre, tu foto de perfil si decides subir una, y lo
          que registras al usar la app: movimientos, metas, apartados,
          categorías y medios de pago.
        </p>
      </Seccion>

      <Seccion titulo="Para qué los usamos">
        <p>
          Solo para que la app funcione: entrar a tu cuenta, mostrarte tus
          números y mandarte los correos de acceso (recuperar contraseña,
          confirmar cambio de correo). Nada más.
        </p>
        <p>
          No vendemos tus datos, no los compartimos para publicidad y no los
          usamos para perfilarte.
        </p>
      </Seccion>

      <Seccion titulo="Inteligencia artificial">
        <p>
          DiNelo no usa inteligencia artificial: ningún modelo lee tus datos y
          nada se entrena con ellos.
        </p>
      </Seccion>

      <Seccion titulo="Quién más puede verlos">
        <p>
          Nadie. Cada cuenta solo puede ver y tocar lo suyo — la separación
          está en la base de datos misma, no es una promesa de la app.
        </p>
        <p>
          Tus datos viven en servicios de infraestructura que usamos para
          operar: Supabase (base de datos y autenticación) y Vercel (hosting),
          con servidores en Estados Unidos, y los correos de acceso salen por
          Gmail. Solo procesan datos por encargo nuestro.
        </p>
        <p>
          Medimos visitas con Vercel Analytics: métricas anónimas y agregadas,
          sin cookies de rastreo y sin perfiles individuales.
        </p>
      </Seccion>

      <Seccion titulo="Cookies">
        <p>
          Solo las esenciales para mantener tu sesión abierta. No hay cookies
          de publicidad ni de rastreo, por eso no verás un banner.
        </p>
      </Seccion>

      <Seccion titulo="Tus derechos">
        <p>
          En la pestaña Cuenta puedes ver y corregir tu información cuando
          quieras. Con «Eliminar cuenta» borras tú misma/o todos tus datos de
          inmediato y para siempre — sin pedirle permiso a nadie ni esperar
          plazos.
        </p>
        <p>
          También puedes ejercer tus derechos de acceso, rectificación,
          cancelación u oposición (ARCO) escribiendo al correo de contacto.
        </p>
      </Seccion>

      <Seccion titulo="Edad mínima">
        <p>DiNelo es para mayores de 18 años.</p>
      </Seccion>

      <Seccion titulo="Cambios a este aviso">
        <p>
          Si este aviso cambia, la versión nueva se publica en esta misma
          página con su fecha de actualización.
        </p>
      </Seccion>

      <span className="text-center text-[10.5px] font-bold text-muted-foreground">
        Última actualización: 1 de septiembre de 2026 ·{" "}
        <Link href="/terminos" className="underline">
          Términos y condiciones
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
