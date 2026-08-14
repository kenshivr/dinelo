import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

// El informe de admin necesita leer TODAS las cuentas y el RLS (a propósito)
// solo deja ver lo propio. Este cliente usa la SECRET KEY: se salta el RLS y
// llega al Admin API de Auth (correos, altas). SERVER-ONLY — la key no lleva
// NEXT_PUBLIC y jamás debe importarse desde un componente cliente.
export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    // sin sesión de navegador: es un cliente de servicio, no de usuario
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Guardia de las vistas de admin: sesión válida Y ser LA cuenta admin.
// Sin ADMIN_USER_ID configurada nadie es admin — falla cerrado.
export async function conAdmin() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const adminId = process.env.ADMIN_USER_ID;
  if (!adminId || data.user.id !== adminId) redirect("/cuenta");
  return { userId: data.user.id };
}
