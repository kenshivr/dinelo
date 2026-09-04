"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { avisarComentario } from "@/lib/correo";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { borrarCuentaCompleta } from "@/lib/supabase/admin";
import { mensajeDeAuth } from "@/lib/supabase/errores";
import { conSesion } from "@/lib/supabase/sesion";
import { TOPE_COMENTARIO } from "@/lib/tipos";

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

// La inicial sigue al nombre (misma regla que el alta: primera letra en
// mayúscula) porque el header y los avatares sin foto la muestran.
export async function cambiarNombre(nuevo: string) {
  const nombre = nuevo.trim();
  if (!nombre) return "Escribe un nombre.";

  const { supabase, userId } = await conSesion();
  const { error } = await supabase
    .from("profiles")
    .update({ nombre, inicial: nombre[0].toUpperCase() })
    .eq("id", userId);
  if (error) {
    console.error("No se pudo cambiar el nombre:", error);
    return "No se pudo cambiar el nombre. Intenta de nuevo.";
  }

  // layout completo: nombre e inicial también viven en el header de las tabs
  revalidatePath("/", "layout");
  return null;
}

// Recibe la foto YA redimensionada por el teléfono (~15 KB) y la sube con la
// sesión del server: el cliente browser iba como anon y el RLS lo rechazaba.
// ?v= rompe el cache al reemplazar la foto (misma URL, contenido nuevo).
export async function subirAvatar(datos: FormData) {
  const archivo = datos.get("archivo");
  if (!(archivo instanceof File)) return "No se pudo leer la foto.";
  // el teléfono la manda de ~15 KB, pero la action es un POST que cualquier
  // sesión puede armar a mano: mismo tope que el bucket (1 MB, solo JPEG)
  if (archivo.type !== "image/jpeg") return "La foto debe ser JPEG.";
  if (archivo.size > 1024 * 1024)
    return "La foto pesa demasiado. Intenta de nuevo.";

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

// Mensaje/idea/comentario para el admin (2026-09-04). Se guarda SIEMPRE en la
// base (lo lista el Informe); el correo es un aviso extra que no bloquea ni
// falla el envío. Devuelve error solo si no se pudo guardar.
export async function enviarComentario(texto: string) {
  const limpio = texto.trim();
  if (!limpio) return "Escribe algo antes de enviar.";
  if (limpio.length > TOPE_COMENTARIO)
    return `Máximo ${TOPE_COMENTARIO} caracteres.`;

  const { supabase, userId } = await conSesion();
  const { error } = await supabase
    .from("comentarios")
    .insert({ user_id: userId, texto: limpio });
  if (error) {
    console.error("No se pudo guardar el comentario:", error);
    return "No se pudo enviar. Intenta de nuevo.";
  }

  // quién escribe: el nombre vive en el perfil, el correo en Auth
  const [{ data: perfil }, { data: auth }] = await Promise.all([
    supabase.from("profiles").select("nombre").eq("id", userId).single(),
    supabase.auth.getUser(),
  ]);
  await avisarComentario({
    nombre: perfil?.nombre ?? "Alguien",
    correo: auth.user?.email ?? "",
    texto: limpio,
  });

  revalidatePath("/cuenta/admin"); // el Informe lista los comentarios
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
