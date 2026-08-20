"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { esCuentaExistente, mensajeDeAuth } from "@/lib/supabase/errores";

export type DatosRegistro = { nombre: string; correo: string; contrasena: string };

// sesion=false → "Confirm email" sigue encendido en Supabase: toca revisar el correo
export type ResultadoRegistro =
  | { ok: true; sesion: boolean }
  | { ok: false; mensaje: string; yaExiste: boolean };

export async function registrar(datos: DatosRegistro): Promise<ResultadoRegistro> {
  const nombre = datos.nombre.trim();
  const correo = datos.correo.trim().toLowerCase();
  // el enlace del correo (si hay) vuelve a ESTE origen (localhost o prod)
  const origen = (await headers()).get("origin") ?? "https://dinelo.vercel.app";

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: datos.contrasena,
    options: {
      data: { nombre }, // el trigger crear_perfil_nuevo lo lee para el profile
      emailRedirectTo: `${origen}/auth/confirm`,
    },
  });

  if (error) {
    return { ok: false, mensaje: mensajeDeAuth(error, "registro"), yaExiste: esCuentaExistente(error) };
  }

  // con confirmación encendida Supabase finge éxito si el correo ya existe
  // (identities vacío) — para una app de amigos preferimos decir la verdad
  if (data.user && data.user.identities?.length === 0) {
    return { ok: false, mensaje: "Ya hay una cuenta con este correo.", yaExiste: true };
  }

  if (data.session) revalidatePath("/", "layout");
  return { ok: true, sesion: data.session !== null };
}
