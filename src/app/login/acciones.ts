"use server";

import { revalidatePath } from "next/cache";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { mensajeDeAuth } from "@/lib/supabase/errores";

// Devuelve el mensaje de error a mostrar, o null si la sesión ya quedó en cookies.
export async function entrar(datos: { correo: string; contrasena: string }) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: datos.correo.trim(),
    password: datos.contrasena,
  });
  if (error) return mensajeDeAuth(error, "login");

  revalidatePath("/", "layout");
  return null;
}
