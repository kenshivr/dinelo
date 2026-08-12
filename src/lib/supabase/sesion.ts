import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

// Cada server action verifica la sesión ADENTRO: son POSTs a su propia ruta,
// el proxy no alcanza como única guardia.
export async function conSesion() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return { supabase, userId: data.user.id };
}
