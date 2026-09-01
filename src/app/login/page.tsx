import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error, correo } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
          DiNelo
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          gastos y ahorros 💛
        </span>
      </div>

      <LoginForm
        correoInicial={typeof correo === "string" ? correo : undefined}
        errorInicial={
          error === "enlace"
            ? "El enlace expiró o ya se usó. Pide otro."
            : undefined
        }
      />

      <Link
        href="/recuperar"
        className="text-center text-xs font-bold text-muted-foreground"
      >
        ¿Olvidaste tu contraseña?
      </Link>
      <Link
        href="/registro"
        className="text-center text-xs font-bold text-muted-foreground"
      >
        ¿No tienes cuenta? <b className="font-black">Regístrate</b>
      </Link>

      <span className="mt-auto flex items-center justify-center gap-3 text-center text-[10.5px] font-bold text-muted-foreground">
        DiNelo v1
        <Link href="/privacidad" className="underline">
          Privacidad
        </Link>
        <Link href="/terminos" className="underline">
          Términos
        </Link>
      </span>
    </main>
  );
}
