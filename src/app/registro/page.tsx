import Link from "next/link";
import { registrar } from "./acciones";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string; error?: string }>;
}) {
  const { enviado, error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
          DiNelo
        </div>
        <span className="text-xs font-bold text-muted-foreground">crear cuenta</span>
      </div>

      {enviado ? (
        <div className="nbs flex flex-col items-center gap-2 px-4 py-9 text-center">
          <span className="text-[42px]">💌</span>
          <b className="text-[15px] font-black">Revisa tu correo</b>
          <span className="text-xs font-bold leading-relaxed text-muted-foreground">
            Te mandamos un enlace para confirmar tu cuenta. Ábrelo en este mismo
            teléfono y entras directo a la app.
          </span>
        </div>
      ) : (
        <form action={registrar} className="flex flex-col gap-3">
          <span className="lbl">Nombre</span>
          <input
            className="nbs finput outline-none"
            name="nombre"
            autoComplete="name"
            placeholder="¿Cómo te llamas?"
            required
          />

          <span className="lbl">Correo</span>
          <input
            className="nbs finput outline-none"
            type="email"
            name="correo"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            required
          />

          <span className="lbl">Contraseña</span>
          <input
            className="nbs finput outline-none"
            type="password"
            name="contrasena"
            autoComplete="new-password"
            placeholder="mínimo 6 caracteres"
            minLength={6}
            required
          />

          {error && (
            <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
              No se pudo crear la cuenta. Intenta de nuevo.
            </div>
          )}

          <button type="submit" className="btn f-y mt-2.5">
            Crear cuenta
          </button>
        </form>
      )}

      <Link href="/login" className="mt-auto text-center text-xs font-bold text-muted-foreground">
        ‹ Ya tengo cuenta
      </Link>
    </div>
  );
}
