import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
          DiNelo
        </div>
        <span className="text-xs font-bold text-muted-foreground">gastos y ahorros, de a dos 💛</span>
      </div>

      <span className="lbl">Correo</span>
      <input
        className="nbs finput outline-none"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="tu@correo.com"
      />

      <span className="lbl">Contraseña</span>
      <input
        className="nbs finput outline-none"
        type="password"
        autoComplete="current-password"
        placeholder="•••••••••"
      />

      {/* fase 2: submit real contra Supabase Auth; por ahora pasa directo a Gastos */}
      <Link href="/gastos" className="btn f-y mt-2.5">
        Entrar
      </Link>

      <span className="text-center text-xs font-bold text-muted-foreground">
        ¿Olvidaste tu contraseña?
      </span>

      <span className="mt-auto text-center text-[10.5px] font-bold text-muted-foreground">
        DiNelo v1 · solo para B &amp; N
      </span>
    </div>
  );
}
