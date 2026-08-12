"use server";

import { revalidatePath } from "next/cache";
import { conSesion } from "@/lib/supabase/sesion";

// Las actions devuelven el mensaje de error a mostrar, o null si todo salió bien.
const NO_GUARDO = "No se pudo guardar. Intenta de nuevo.";
const NO_BORRO = "No se pudo borrar. Intenta de nuevo.";

// El RLS solo deja tocar movimientos propios; el Dash y el Historial se revalidan
// porque ambos leen movimientos.
export async function guardarMovimiento(datos: {
  id: string;
  concepto: string;
  monto: number;
  categoriaId?: string; // solo gastos; en ingresos queda null (check gasto_con_categoria)
  medioId: string;
  fecha: string;
}) {
  const { supabase } = await conSesion();
  const { error } = await supabase
    .from("movimientos")
    .update({
      concepto: datos.concepto,
      monto: datos.monto,
      categoria_id: datos.categoriaId ?? null,
      medio_id: datos.medioId,
      fecha: datos.fecha,
    })
    .eq("id", datos.id);
  if (error) return NO_GUARDO;
  revalidatePath("/dash");
  revalidatePath("/cuenta/historial");
  return null;
}

export async function borrarMovimiento(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("movimientos").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/dash");
  revalidatePath("/cuenta/historial");
  return null;
}
