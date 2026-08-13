"use server";

import { revalidatePath } from "next/cache";
import { conSesion } from "@/lib/supabase/sesion";

// Las actions devuelven el mensaje de error a mostrar, o null si todo salió bien.
const NO_GUARDO = "No se pudo guardar. Intenta de nuevo.";
const NO_BORRO = "No se pudo borrar. Intenta de nuevo.";

export async function guardarMeta(datos: { id?: string; nombre: string; descripcion: string; objetivo: number }) {
  const { supabase, userId } = await conSesion();
  const fila = { nombre: datos.nombre, descripcion: datos.descripcion, objetivo: datos.objetivo };
  const { error } = datos.id
    ? await supabase.from("metas").update(fila).eq("id", datos.id)
    : await supabase.from("metas").insert({ ...fila, user_id: userId });
  if (error) return NO_GUARDO;
  revalidatePath("/metas");
  return null;
}

export async function borrarMeta(id: string) {
  // el cascade del esquema se lleva también sus aportes
  const { supabase } = await conSesion();
  const { error } = await supabase.from("metas").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/metas");
  return null;
}

export async function aportar(datos: { metaId: string; monto: number; medioId: string; fecha: string }) {
  const { supabase, userId } = await conSesion();
  const { error } = await supabase.from("aportes").insert({
    meta_id: datos.metaId,
    medio_id: datos.medioId,
    monto: datos.monto,
    fecha: datos.fecha,
    user_id: userId,
  });
  if (error) return NO_GUARDO;
  revalidatePath("/metas");
  return null;
}

export async function borrarAporte(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("aportes").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/metas");
  return null;
}
