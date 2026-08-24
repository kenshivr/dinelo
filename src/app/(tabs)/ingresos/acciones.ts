"use server";

import { revalidatePath } from "next/cache";
import { conSesion } from "@/lib/supabase/sesion";

// Devuelve el mensaje de error a mostrar, o null si todo salió bien.
export async function registrarIngreso(datos: {
  concepto: string;
  monto: number;
  medioId: string | null; // null = "Sin medio"
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
  revalidatePath("/dash"); // el Dash lee movimientos: sin esto mostraría cache viejo
  return null;
}

// Alta rápida desde la captura: devuelve el id para dejar el medio nuevo ya
// seleccionado. Se revalida cada vista que lee medios (Gastos, Metas y Conf).
export async function crearMedio(datos: { nombre: string; emoji: string; tipo: string; saldoInicial: number }) {
  const { supabase, userId } = await conSesion();
  const { data, error } = await supabase
    .from("medios")
    .insert({
      nombre: datos.nombre,
      emoji: datos.emoji,
      tipo: datos.tipo || null,
      saldo_inicial: datos.saldoInicial,
      user_id: userId,
    })
    .select("id")
    .single();
  if (error || !data) return { id: null, error: "No se pudo guardar. Intenta de nuevo." };
  revalidatePath("/ingresos");
  revalidatePath("/gastos");
  revalidatePath("/metas");
  revalidatePath("/cuenta/configuracion");
  return { id: data.id as string, error: null };
}
