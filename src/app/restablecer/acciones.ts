"use server";

import { conSesion } from "@/lib/supabase/sesion";
import { mensajeDeAuth } from "@/lib/supabase/errores";

// Devuelve el mensaje de error a mostrar, o null si la contraseña ya cambió.
export async function restablecer(nueva: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.auth.updateUser({ password: nueva });
  return error ? mensajeDeAuth(error, "restablecer") : null;
}
