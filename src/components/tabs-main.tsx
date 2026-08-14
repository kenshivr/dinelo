"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// El scroll vive en este <main>, no en el document: Next solo resetea el
// scroll del document al navegar, así que al cambiar de tab volvemos al tope.
export function TabsMain({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main
      ref={ref}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-[18px] pb-11 pt-[calc(env(safe-area-inset-top)+12px)] has-[.dock]:pb-0"
    >
      {children}
    </main>
  );
}
