"use server";

import { conSesion } from "@/lib/supabase/sesion";

// Devuelve el mensaje de error a mostrar, o null si la contraseña ya cambió.
export async function restablecer(nueva: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.auth.updateUser({ password: nueva });
  if (!error) return null;
  if (error.code === "same_password") return "La nueva contraseña es igual a la anterior.";
  if (error.code === "weak_password") return "Muy débil: usa al menos 6 caracteres.";
  return "No se pudo cambiar. Intenta de nuevo.";
}
