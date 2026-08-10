import { createBrowserClient } from "@supabase/ssr";

// Cliente para componentes "use client" (TanStack Query, realtime, etc.)
export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
