"use server";

import { headers } from "next/headers";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { mensajeDeAuth } from "@/lib/supabase/errores";

// Devuelve el mensaje de error a mostrar, o null si el enlace salió (o el correo
// no existe: Supabase no lo distingue a propósito y la pantalla tampoco).
export async function mandarRecuperacion(correo: string) {
  // el enlace del correo vuelve a ESTE origen (localhost o prod, según dónde se pidió)
  const origen = (await headers()).get("origin") ?? "https://dinelo.vercel.app";

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.resetPasswordForEmail(correo.trim(), {
    redirectTo: `${origen}/auth/confirm`,
  });
  return error ? mensajeDeAuth(error, "recuperar") : null;
}
