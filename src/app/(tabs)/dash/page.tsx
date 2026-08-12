import { redirect } from "next/navigation";
import { DashView } from "@/components/dash/dash-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { sumarMes } from "@/lib/mes";
import type { Categoria, Medio, Movimiento } from "@/lib/tipos";

export default async function DashPage({ searchParams }: PageProps<"/dash">) {
  const { mes: mesParam } = await searchParams;
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // Sin ?mes= el server arranca en SU mes actual (UTC); si el teléfono va en
  // otro mes (tarde del último día), DashView corrige con un replace.
  const mesValido = typeof mesParam === "string" && /^\d{4}-\d{2}$/.test(mesParam) ? mesParam : null;
  const mes = mesValido ?? new Date().toISOString().slice(0, 7);

  const [perfiles, categorias, medios, movs] = await Promise.all([
    supabase.from("profiles").select("id, nombre, inicial, color").order("created_at"),
    supabase.from("categorias").select("id, nombre, color").order("created_at"),
    // de AMBOS: el detalle "categoría · medio" también se pinta en lo del otro
    supabase.from("medios").select("id, nombre, emoji, tipo"),
    supabase
      .from("movimientos")
      .select("id, user_id, tipo, concepto, monto, categoria_id, medio_id, fecha")
      .gte("fecha", `${mes}-01`)
      .lt("fecha", `${sumarMes(mes, 1)}-01`)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const movimientos: Movimiento[] = (movs.data ?? []).map((m) => ({
    id: m.id,
    perfilId: m.user_id,
    tipo: m.tipo as Movimiento["tipo"],
    concepto: m.concepto,
    monto: m.monto,
    categoriaId: m.categoria_id ?? undefined,
    medioId: m.medio_id,
    fecha: m.fecha,
  }));

  return (
    <DashView
      mes={mes}
      esDefault={mesValido === null}
      movimientos={movimientos}
      categorias={(categorias.data ?? []) as Categoria[]}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
      perfiles={perfiles.data ?? []}
    />
  );
}
