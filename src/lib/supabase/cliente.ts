import { createBrowserClient } from "@supabase/ssr";

// RESERVADO sin consumidores hoy: la capa de caché (etapa 2 de velocidad,
// TanStack Query + captura optimista) lo va a necesitar — no borrar.
export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
