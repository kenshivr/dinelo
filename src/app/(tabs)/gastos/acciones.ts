"use server";

import { conSesion } from "@/lib/supabase/sesion";

// Devuelve el mensaje de error a mostrar, o null si todo salió bien.
export async function registrarGasto(datos: {
  concepto: string;
  monto: number;
  categoriaId: string;
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
  return null;
}
