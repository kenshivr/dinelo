"use server";

import { revalidatePath } from "next/cache";
import { conSesion } from "@/lib/supabase/sesion";
import type { ColorBloque } from "@/lib/tipos";

// Devuelve el mensaje de error a mostrar, o null si todo salió bien.
export async function registrarGasto(datos: {
  concepto: string;
  monto: number;
  categoriaId: string | null; // null = "Sin categoría" (categoria-opcional.sql)
  medioId: string;
  fecha: string; // yyyy-mm-dd local del cliente: el default current_date corre en UTC
}) {
  const { supabase, userId } = await conSesion();
  const { error } = await supabase.from("movimientos").insert({
    user_id: userId,
    tipo: "gasto",
    concepto: datos.concepto,
    monto: datos.monto,
    categoria_id: datos.categoriaId,
    medio_id: datos.medioId,
    fecha: datos.fecha,
  });
  if (error) return "No se pudo registrar. Intenta de nuevo.";
  revalidatePath("/dash"); // el Dash lee movimientos: sin esto mostraría cache viejo
  return null;
}

// Alta rápida desde la captura: devuelve el id para dejar la categoría nueva
// ya seleccionada en el form (el chip llega después, con la revalidación).
export async function crearCategoria(datos: { nombre: string; color: ColorBloque }) {
  const { supabase, userId } = await conSesion();
  const { data, error } = await supabase
    .from("categorias")
    .insert({ nombre: datos.nombre, color: datos.color, user_id: userId })
    .select("id")
    .single();
  if (error || !data) return { id: null, error: "No se pudo guardar. Intenta de nuevo." };
  revalidatePath("/gastos");
  revalidatePath("/cuenta/configuracion"); // Conf muestra la misma lista
  return { id: data.id as string, error: null };
}
