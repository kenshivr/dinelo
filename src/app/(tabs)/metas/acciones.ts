"use server";

import { revalidatePath } from "next/cache";
import { conSesion } from "@/lib/supabase/sesion";
import { fmtMonto } from "@/lib/formato";

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

// medioId opcional (aportes-medio-opcional.sql): sin medio = null
export async function aportar(datos: { metaId: string; monto: number; medioId: string | null; fecha: string }) {
  const { supabase, userId } = await conSesion();

  // El cliente ya avisa, pero puede estar desactualizado (aporte desde otro
  // dispositivo): la meta nunca acepta más de lo que le falta.
  const [{ data: meta }, { data: previos }] = await Promise.all([
    supabase.from("metas").select("objetivo").eq("id", datos.metaId).single(),
    supabase.from("aportes").select("monto").eq("meta_id", datos.metaId),
  ]);
  if (!meta) return NO_GUARDO;
  const restante = meta.objetivo - (previos ?? []).reduce((suma, a) => suma + a.monto, 0);
  if (datos.monto > restante)
    return restante > 0
      ? `Solo faltan ${fmtMonto(restante)} para completar esta meta.`
      : "Esta meta ya está cumplida.";

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

// ═══ Apartados (tab Control) ═══

export async function guardarApartado(datos: {
  id?: string;
  nombre: string;
  monto: number;
  mes: string; // yyyy-mm del teléfono
  categoriaId: string | null;
}) {
  const { supabase, userId } = await conSesion();
  const fila = { nombre: datos.nombre, monto: datos.monto, categoria_id: datos.categoriaId };
  const { error } = datos.id
    ? await supabase.from("apartados").update(fila).eq("id", datos.id)
    : await supabase.from("apartados").insert({ ...fila, mes: datos.mes, user_id: userId });
  if (error) return NO_GUARDO;
  revalidatePath("/metas");
  revalidatePath("/dash");
  return null;
}

export async function borrarApartado(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("apartados").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/metas");
  revalidatePath("/dash");
  return null;
}

// ═══ Transferencias (Control › Medios) ═══

// Mueve dinero entre medios sin crear gasto ni ingreso: el Dash no la ve,
// solo cambia el saldo de las dos cards.
export async function transferir(datos: { origenId: string; destinoId: string; monto: number; fecha: string }) {
  const { supabase, userId } = await conSesion();
  if (datos.origenId === datos.destinoId) return "Elige un medio distinto al de origen.";
  const { error } = await supabase.from("transferencias").insert({
    user_id: userId,
    origen_id: datos.origenId,
    destino_id: datos.destinoId,
    monto: datos.monto,
    fecha: datos.fecha,
  });
  if (error) return NO_GUARDO;
  revalidatePath("/metas");
  return null;
}

export async function borrarTransferencia(id: string) {
  const { supabase } = await conSesion();
  const { error } = await supabase.from("transferencias").delete().eq("id", id);
  if (error) return NO_BORRO;
  revalidatePath("/metas");
  return null;
}

// "Ya lo pagué": crea el gasto REAL (fecha de hoy, del teléfono) y liga el
// apartado. Si después borran ese gasto del Historial, el apartado vuelve a
// pendiente solo (on delete set null en el esquema).
export async function pagarApartado(datos: {
  id: string;
  medioId: string | null; // opcionales, como en la captura de Gastos
  categoriaId: string | null;
  fecha: string;
}) {
  const { supabase, userId } = await conSesion();
  const { data: apartado } = await supabase
    .from("apartados")
    .select("nombre, monto, movimiento_id")
    .eq("id", datos.id)
    .single();
  if (!apartado) return NO_GUARDO;
  if (apartado.movimiento_id) return "Este apartado ya está pagado.";

  const { data: mov, error } = await supabase
    .from("movimientos")
    .insert({
      user_id: userId,
      tipo: "gasto",
      concepto: apartado.nombre,
      monto: apartado.monto,
      categoria_id: datos.categoriaId,
      medio_id: datos.medioId,
      fecha: datos.fecha,
    })
    .select("id")
    .single();
  if (error || !mov) return NO_GUARDO;

  const { error: liga } = await supabase
    .from("apartados")
    .update({ movimiento_id: mov.id, categoria_id: datos.categoriaId })
    .eq("id", datos.id);
  // si la liga falla el gasto ya existe: mejor avisar y dejar el apartado
  // visible (borrarlo a mano) que arriesgar un gasto duplicado reintentando
  if (liga) return "El gasto se registró, pero el apartado no se pudo marcar — bórralo a mano.";

  revalidatePath("/metas");
  revalidatePath("/dash");
  revalidatePath("/cuenta/historial");
  return null;
}
