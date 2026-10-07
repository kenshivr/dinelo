import Link from "next/link";
import { RegistroForm } from "@/components/registro-form";
import { Logo } from "@/components/logo";

export default function RegistroPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <Logo />
        <span className="text-xs font-bold text-muted-foreground">
          crear cuenta
        </span>
      </div>

      <RegistroForm />

      <Link
        href="/login"
        className="mt-auto text-center text-xs font-bold text-muted-foreground"
      >
        ‹ Ya tengo cuenta
      </Link>
    </main>
  );
}
