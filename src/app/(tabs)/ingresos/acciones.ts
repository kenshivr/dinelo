"use server";

import { conSesion } from "@/lib/supabase/sesion";

// Devuelve el mensaje de error a mostrar, o null si todo salió bien.
export async function registrarIngreso(datos: {
  concepto: string;
  monto: number;
  medioId: string;
  fecha: string; // yyyy-mm-dd local del cliente: el default current_date corre en UTC
}) {
  const { supabase, userId } = await conSesion();
  // sin categoria_id: el check gasto_con_categoria exige null en ingresos
  const { error } = await supabase.from("movimientos").insert({
    user_id: userId,
    tipo: "ingreso",
    concepto: datos.concepto,
    monto: datos.monto,
    medio_id: datos.medioId,
    fecha: datos.fecha,
  });
  if (error) return "No se pudo registrar. Intenta de nuevo.";
  return null;
}
