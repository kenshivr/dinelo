import { redirect } from "next/navigation";
import { DashView } from "@/components/dash/dash-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { sumarMes } from "@/lib/mes";
import { movimientoDeFila, type Categoria, type Medio } from "@/lib/tipos";

export default async function DashPage({ searchParams }: PageProps<"/dash">) {
  const { mes: mesParam } = await searchParams;
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // Sin ?mes= el server arranca en SU mes actual (UTC); si el teléfono va en
  // otro mes (tarde del último día), DashView corrige con un replace.
  const mesValido = typeof mesParam === "string" && /^\d{4}-\d{2}$/.test(mesParam) ? mesParam : null;
  const mes = mesValido ?? new Date().toISOString().slice(0, 7);

  // App individual (2026-08-13): el Dash es SOLO del logueado — nada del otro.
  const [categorias, medios, movs, movsPrev, apartados] = await Promise.all([
    supabase.from("categorias").select("id, nombre, color").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id),
    supabase
      .from("movimientos")
      .select("id, user_id, tipo, concepto, monto, categoria_id, medio_id, fecha")
      .eq("user_id", auth.user.id)
      .gte("fecha", `${mes}-01`)
      .lt("fecha", `${sumarMes(mes, 1)}-01`)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false }),
    // mes anterior solo para la comparativa de las almohadillas: tipo y monto bastan
    supabase
      .from("movimientos")
      .select("tipo, monto")
      .eq("user_id", auth.user.id)
      .gte("fecha", `${sumarMes(mes, -1)}-01`)
      .lt("fecha", `${mes}-01`),
    // apartados pendientes hasta el mes visible (RLS ya los deja solo míos);
    // lo no pagado de meses viejos sigue comprometido, por eso lte y no eq
    supabase.from("apartados").select("monto").is("movimiento_id", null).lte("mes", mes),
  ]);

  const filasPrev = movsPrev.data ?? [];
  const totalPrev = (tipo: string) =>
    filasPrev.filter((m) => m.tipo === tipo).reduce((s, m) => s + m.monto, 0);

  return (
    <DashView
      mes={mes}
      esDefault={mesValido === null}
      movimientos={(movs.data ?? []).map(movimientoDeFila)}
      categorias={(categorias.data ?? []) as Categoria[]}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
      previos={{ ingresos: totalPrev("ingreso"), gastos: totalPrev("gasto") }}
      apartadosPendientes={(apartados.data ?? []).reduce((s, a) => s + a.monto, 0)}
    />
  );
}
