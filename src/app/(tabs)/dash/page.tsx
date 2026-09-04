import { redirect } from "next/navigation";
import { DashView } from "@/components/dash/dash-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { sumarMes } from "@/lib/mes";
import { saldoTotal, type MovimientoDeSaldo } from "@/lib/saldos";
import { movimientoDeFila, type Categoria, type Medio } from "@/lib/tipos";

export default async function DashPage({ searchParams }: PageProps<"/dash">) {
  const { mes: mesParam } = await searchParams;
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // Sin ?mes= el server arranca en SU mes actual (UTC); si el teléfono va en
  // otro mes (tarde del último día), DashView corrige con un replace.
  const mesValido =
    typeof mesParam === "string" && /^\d{4}-\d{2}$/.test(mesParam)
      ? mesParam
      : null;
  const mes = mesValido ?? new Date().toISOString().slice(0, 7);
  const inicioMes = `${mes}-01`;
  const inicioSiguiente = `${sumarMes(mes, 1)}-01`;

  // App individual (2026-08-13): el Dash es SOLO del logueado — nada del otro.
  const [categorias, medios, movs, historial, transferencias, apartados] =
    await Promise.all([
      supabase
        .from("categorias")
        .select("id, nombre, color")
        .eq("user_id", auth.user.id)
        .order("orden", { nullsFirst: false })
        .order("created_at"),
      supabase
        .from("medios")
        .select("id, nombre, emoji, tipo, saldo_inicial")
        .eq("user_id", auth.user.id),
      supabase
        .from("movimientos")
        .select(
          "id, user_id, tipo, concepto, monto, categoria_id, medio_id, fecha",
        )
        .eq("user_id", auth.user.id)
        .gte("fecha", inicioMes)
        .lt("fecha", inicioSiguiente)
        .order("fecha", { ascending: false })
        .order("created_at", { ascending: false }),
      // TODO el historial hasta el cierre del mes visible (2026-09-03): de aquí
      // salen el Restante (saldo real, no del mes) y la comparativa con el mes
      // anterior; solo lo que el saldo necesita
      supabase
        .from("movimientos")
        .select("tipo, monto, medio_id, fecha")
        .eq("user_id", auth.user.id)
        .lt("fecha", inicioSiguiente),
      supabase
        .from("transferencias")
        .select("origen_id, destino_id, monto")
        .eq("user_id", auth.user.id)
        .lt("fecha", inicioSiguiente),
      // apartados pendientes hasta el mes visible (RLS ya los deja solo míos);
      // lo no pagado de meses viejos sigue comprometido, por eso lte y no eq
      supabase
        .from("apartados")
        .select("monto")
        .is("movimiento_id", null)
        .lte("mes", mes),
    ]);

  const filasHistorial = historial.data ?? [];
  const inicioPrevio = `${sumarMes(mes, -1)}-01`;
  const totalPrev = (tipo: string) =>
    filasHistorial
      .filter(
        (m) => m.tipo === tipo && m.fecha >= inicioPrevio && m.fecha < inicioMes,
      )
      .reduce((s, m) => s + m.monto, 0);

  const listaMedios = (medios.data ?? []).map((m): Medio => ({
    id: m.id,
    nombre: m.nombre,
    emoji: m.emoji,
    tipo: m.tipo ?? "",
    saldoInicial: m.saldo_inicial,
  }));

  // Restante = saldo real al cierre del mes visible (hoy, si es el mes actual):
  // inicial de los medios + todo lo registrado, misma cuenta que Control › Medios
  const restante = saldoTotal(
    listaMedios,
    filasHistorial.map((v): MovimientoDeSaldo => ({
      tipo: v.tipo as MovimientoDeSaldo["tipo"],
      monto: v.monto,
      medioId: v.medio_id,
    })),
    (transferencias.data ?? []).map((t) => ({
      origenId: t.origen_id,
      destinoId: t.destino_id,
      monto: t.monto,
    })),
  );

  return (
    <DashView
      mes={mes}
      esDefault={mesValido === null}
      movimientos={(movs.data ?? []).map(movimientoDeFila)}
      categorias={(categorias.data ?? []) as Categoria[]}
      medios={listaMedios}
      previos={{ ingresos: totalPrev("ingreso"), gastos: totalPrev("gasto") }}
      restante={restante}
      hayHistorial={
        filasHistorial.length > 0 || listaMedios.some((m) => m.saldoInicial)
      }
      apartadosPendientes={(apartados.data ?? []).reduce(
        (s, a) => s + a.monto,
        0,
      )}
    />
  );
}
