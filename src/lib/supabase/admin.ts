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
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

// Borrado completo de una cuenta: datos, foto y Auth. El orden importa —
// movimientos y aportes apuntan a medios/categorías con on delete RESTRICT,
// así que la cascada de profiles abortaría si llega a un medio antes que a sus
// movimientos. Se limpian primero a mano y deleteUser dispara la cascada que
// barre el resto (perfil, medios, categorías, frecuentes, metas, apartados).
// La usan eliminarCuenta (el propio usuario) y el informe de admin.
export async function borrarCuentaCompleta(userId: string) {
  const admin = crearClienteAdmin();
  const movimientos = await admin
    .from("movimientos")
    .delete()
    .eq("user_id", userId);
  const aportes = await admin.from("aportes").delete().eq("user_id", userId);
  if (movimientos.error || aportes.error) {
    console.error(
      "No se pudo limpiar antes de borrar:",
      movimientos.error ?? aportes.error,
    );
    return "No se pudo eliminar la cuenta. Intenta de nuevo.";
  }

  // la foto no cae con la cascada (Storage va aparte); sin foto no es error
  await admin.storage.from("avatares").remove([`${userId}.jpg`]);

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Auth no pudo borrar la cuenta:", error);
    return "No se pudo eliminar la cuenta. Intenta de nuevo.";
  }
  return null;
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
