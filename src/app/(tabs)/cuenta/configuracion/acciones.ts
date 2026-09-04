"use server";

import { revalidatePath } from "next/cache";
import { capitalizarPalabras } from "@/lib/formato";
import { conSesion } from "@/lib/supabase/sesion";
import type { ColorBloque } from "@/lib/tipos";

// Las actions devuelven el mensaje de error a mostrar, o null si todo salió bien.
const NO_GUARDO = "No se pudo guardar. Intenta de nuevo.";
const NO_BORRO = "No se pudo borrar. Intenta de nuevo.";
// Borrar una categoría o un medio nunca bloquea (on delete set null en seed.sql):
// movimientos, apartados y aportes quedan "sin" — la UI avisa cuántos antes de confirmar.

export async function guardarCategoria(datos: {
  id?: string;
  nombre: string;
  color: ColorBloque;
}) {
  const { supabase, userId } = await conSesion();
  const fila = { nombre: datos.nombre, color: datos.color };
  const { error } = datos.id
    ? await supabase.from("categorias").update(fila).eq("id", datos.id)
    : await supabase.from("categorias").insert({ ...fila, user_id: userId });
  if (error) return NO_GUARDO;
  revalidatePath("/cuenta/configuracion");
  return null;
}

export async function borrarCategoria(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/cuenta/configuracion");
  return null;
}

export async function guardarMedio(datos: {
  id?: string;
  nombre: string;
  emoji: string;
  tipo: string;
  saldoInicial: number;
}) {
  const { supabase, userId } = await conSesion();
  const fila = {
    nombre: datos.nombre,
    emoji: datos.emoji,
    tipo: datos.tipo || null,
    saldo_inicial: datos.saldoInicial,
  };
  const { error } = datos.id
    ? await supabase.from("medios").update(fila).eq("id", datos.id)
    : await supabase.from("medios").insert({ ...fila, user_id: userId });
  if (error) return NO_GUARDO;
  revalidatePath("/cuenta/configuracion");
  revalidatePath("/metas"); // Control › Medios muestra el saldo
  return null;
}

export async function borrarMedio(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("medios").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/cuenta/configuracion");
  revalidatePath("/metas"); // su card desaparece de Control › Medios
  return null;
}

export async function guardarFrecuente(datos: {
  id?: string;
  nombre: string;
  emoji: string;
  tipo: "G" | "I";
}) {
  const { supabase, userId } = await conSesion();
  // los frecuentes alimentan el concepto: misma regla de mayúsculas que los movimientos
  const fila = {
    nombre: capitalizarPalabras(datos.nombre),
    emoji: datos.emoji,
    tipo: datos.tipo,
  };
  const { error } = datos.id
    ? await supabase.from("frecuentes").update(fila).eq("id", datos.id)
    : await supabase.from("frecuentes").insert({ ...fila, user_id: userId });
  if (error) return NO_GUARDO;
  revalidatePath("/cuenta/configuracion");
  return null;
}

// Orden manual (Configuración › Ordenar, 2026-09-04): la posición es el índice en
// la lista que manda el cliente. Un update por fila (RLS solo deja las propias);
// a esta escala (≤ 15 filas) no amerita una función SQL. Se revalida cada vista
// que lista categorías, medios o frecuentes.
export async function guardarOrden(
  coleccion: "categorias" | "medios" | "frecuentes",
  ids: string[],
) {
  const { supabase } = await conSesion();
  const resultados = await Promise.all(
    ids.map((id, orden) =>
      supabase.from(coleccion).update({ orden }).eq("id", id),
    ),
  );
  if (resultados.some((r) => r.error)) return NO_GUARDO;
  revalidatePath("/cuenta/configuracion");
  revalidatePath("/cuenta/historial");
  revalidatePath("/gastos");
  revalidatePath("/ingresos");
  revalidatePath("/metas");
  revalidatePath("/dash");
  return null;
}

export async function borrarFrecuente(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("frecuentes").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/cuenta/configuracion");
  return null;
}
