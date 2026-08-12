import { redirect } from "next/navigation";
import { HistorialView } from "@/components/historial/historial-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { sumarMes } from "@/lib/mes";
import { movimientoDeFila, type Categoria, type Medio } from "@/lib/tipos";

export default async function HistorialPage({ searchParams }: PageProps<"/cuenta/historial">) {
  const { mes: mesParam } = await searchParams;
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // Sin ?mes= el server arranca en SU mes actual (UTC); la vista corrige el borde.
  const mesValido = typeof mesParam === "string" && /^\d{4}-\d{2}$/.test(mesParam) ? mesParam : null;
  const mes = mesValido ?? new Date().toISOString().slice(0, 7);

  const [primero, categorias, medios, movs] = await Promise.all([
    // el mes más viejo con datos: piso del dropdown (cubre fechas editadas hacia atrás)
    supabase
      .from("movimientos")
      .select("fecha")
      .eq("user_id", auth.user.id)
      .order("fecha", { ascending: true })
      .limit(1),
    supabase.from("categorias").select("id, nombre, color").order("created_at"),
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
    supabase
      .from("movimientos")
      .select("id, user_id, tipo, concepto, monto, categoria_id, medio_id, fecha")
      .eq("user_id", auth.user.id) // el Historial es personal: SOLO lo mío
      .gte("fecha", `${mes}-01`)
      .lt("fecha", `${sumarMes(mes, 1)}-01`)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  return (
    <HistorialView
      mes={mes}
      esDefault={mesValido === null}
      desdeMes={primero.data?.[0]?.fecha.slice(0, 7) ?? mes}
      movimientos={(movs.data ?? []).map(movimientoDeFila)}
      categorias={(categorias.data ?? []) as Categoria[]}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
    />
  );
}
