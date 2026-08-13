"use client";

// La sirve el service worker cuando una navegación falla sin red (fallback de sw.ts).
export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-3 px-[18px] text-center">
      <div className="f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]">
        DiNelo
      </div>
      <p className="mt-4 text-sm font-extrabold">Sin conexión 📡</p>
      <p className="text-xs font-bold text-muted-foreground">
        DiNelo necesita internet para tus datos. Revisa tu señal y vuelve a intentarlo.
      </p>
      <button type="button" className="btn f-y mt-2.5" onClick={() => location.reload()}>
        Reintentar
      </button>
    </div>
  );
}
