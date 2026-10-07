"use client";

import { Logo } from "@/components/logo";

// La sirve el service worker cuando una navegación falla sin red (fallback de sw.ts).
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-3 px-[18px] text-center">
      <Logo />
      <p className="mt-4 text-sm font-extrabold">Sin conexión 📡</p>
      <p className="text-xs font-bold text-muted-foreground">
        DiNelo necesita internet para tus datos. Revisa tu señal y vuelve a
        intentarlo.
      </p>
      <button
        type="button"
        className="btn f-y mt-2.5"
        onClick={() => location.reload()}
      >
        Reintentar
      </button>
    </main>
  );
}
