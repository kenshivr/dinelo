"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { borrarCuentaCompleta } from "@/lib/supabase/admin";
import { mensajeDeAuth } from "@/lib/supabase/errores";
import { conSesion } from "@/lib/supabase/sesion";

export async function salir() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

// Las actions devuelven el mensaje de error a mostrar, o null si todo salió bien.

export async function cambiarContrasena(nueva: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.auth.updateUser({ password: nueva });
  return error ? mensajeDeAuth(error, "cambiar-contrasena") : null;
}

// El correo NO cambia de inmediato: Supabase manda enlaces de confirmación
// (al actual y al nuevo — "secure email change"); null = enlaces enviados.
export async function cambiarCorreo(nuevo: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.auth.updateUser({ email: nuevo });
  return error ? mensajeDeAuth(error, "cambiar-correo") : null;
}

// Recibe la foto YA redimensionada por el teléfono (~15 KB) y la sube con la
// sesión del server: el cliente browser iba como anon y el RLS lo rechazaba.
// ?v= rompe el cache al reemplazar la foto (misma URL, contenido nuevo).
export async function subirAvatar(datos: FormData) {
  const archivo = datos.get("archivo");
  if (!(archivo instanceof File)) return "No se pudo leer la foto.";

  const { supabase, userId } = await conSesion();
  const { error } = await supabase.storage
    .from("avatares")
    .upload(`${userId}.jpg`, archivo, {
      upsert: true,
      contentType: "image/jpeg",
    });
  if (error) {
    console.error("Storage rechazó la subida:", error);
    return "No se pudo subir la foto. Intenta de nuevo.";
  }

  const { data } = supabase.storage
    .from("avatares")
    .getPublicUrl(`${userId}.jpg`);
  const { error: errorPerfil } = await supabase
    .from("profiles")
    .update({ avatar_url: `${data.publicUrl}?v=${Date.now()}` })
    .eq("id", userId);
  if (errorPerfil) {
    console.error("No se pudo escribir avatar_url:", errorPerfil);
    return "No se pudo guardar la foto. Intenta de nuevo.";
  }

  // layout completo: el avatar también vive en el header de TODAS las tabs
  revalidatePath("/", "layout");
  return null;
}

// El usuario borra SU cuenta (el cómo vive en borrarCuentaCompleta).
export async function eliminarCuenta() {
  const { supabase, userId } = await conSesion();
  // sin la admin no hay informe: esa solo se borra desde el dashboard de Supabase
  if (userId === process.env.ADMIN_USER_ID)
    return "La cuenta admin no se elimina desde la app.";

  const e = await borrarCuentaCompleta(userId);
  if (e) return e;

  // signOut limpia las cookies locales aunque el usuario ya no exista
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
