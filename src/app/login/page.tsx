import Link from "next/link";
import { entrar } from "./acciones";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
          DiNelo
        </div>
        <span className="text-xs font-bold text-muted-foreground">gastos y ahorros 💛</span>
      </div>

      <form action={entrar} className="flex flex-col gap-3">
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
          autoComplete="current-password"
          placeholder="•••••••••"
          required
        />

        {error && (
          <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
            {error === "enlace"
              ? "El enlace expiró o ya se usó. Pedí otro."
              : "Correo o contraseña incorrectos"}
          </div>
        )}

        <button type="submit" className="btn f-y mt-2.5">
          Entrar
        </button>
      </form>

      <Link href="/recuperar" className="text-center text-xs font-bold text-muted-foreground">
        ¿Olvidaste tu contraseña?
      </Link>
      <Link href="/registro" className="text-center text-xs font-bold text-muted-foreground">
        ¿No tenés cuenta? <b className="font-black">Registrate</b>
      </Link>

      <span className="mt-auto text-center text-[10.5px] font-bold text-muted-foreground">
        DiNelo v1
      </span>
    </div>
  );
}
