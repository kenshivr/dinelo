"use server";

import { revalidatePath } from "next/cache";
import { conSesion } from "@/lib/supabase/sesion";
import type { ColorBloque } from "@/lib/tipos";

// Las actions devuelven el mensaje de error a mostrar, o null si todo salió bien.
const NO_GUARDO = "No se pudo guardar. Intenta de nuevo.";
const NO_BORRO = "No se pudo borrar. Intenta de nuevo.";
// 23503 = foreign key violation: el on delete restrict del esquema protegió movimientos.
const CON_MOVIMIENTOS = "No se puede borrar: tiene movimientos registrados.";

export async function guardarCategoria(datos: { id?: string; nombre: string; color: ColorBloque }) {
  const { supabase } = await conSesion();
  const fila = { nombre: datos.nombre, color: datos.color };
  const { error } = datos.id
    ? await supabase.from("categorias").update(fila).eq("id", datos.id)
    : await supabase.from("categorias").insert(fila);
  if (error) return NO_GUARDO;
  revalidatePath("/conf");
  return null;
}

export async function borrarCategoria(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) return error.code === "23503" ? CON_MOVIMIENTOS : NO_BORRO;
  revalidatePath("/conf");
  return null;
}

export async function guardarMedio(datos: { id?: string; nombre: string; emoji: string; tipo: string }) {
  const { supabase, userId } = await conSesion();
  const fila = { nombre: datos.nombre, emoji: datos.emoji, tipo: datos.tipo || null };
  const { error } = datos.id
    ? await supabase.from("medios").update(fila).eq("id", datos.id)
    : await supabase.from("medios").insert({ ...fila, user_id: userId });
  if (error) return NO_GUARDO;
  revalidatePath("/conf");
  return null;
}

export async function borrarMedio(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("medios").delete().eq("id", id);
  if (error) return error.code === "23503" ? CON_MOVIMIENTOS : NO_BORRO;
  revalidatePath("/conf");
  return null;
}

export async function guardarFrecuente(datos: { id?: string; nombre: string; emoji: string; tipo: "G" | "I" }) {
  const { supabase } = await conSesion();
  const fila = { nombre: datos.nombre, emoji: datos.emoji, tipo: datos.tipo };
  const { error } = datos.id
    ? await supabase.from("frecuentes").update(fila).eq("id", datos.id)
    : await supabase.from("frecuentes").insert(fila);
  if (error) return NO_GUARDO;
  revalidatePath("/conf");
  return null;
}

export async function borrarFrecuente(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("frecuentes").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/conf");
  return null;
}
