import { redirect } from "next/navigation";
import { ControlView } from "@/components/control/control-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { saldosPorMedio, type MovimientoDeSaldo } from "@/lib/saldos";
import type {
  Apartado,
  Aporte,
  Categoria,
  Medio,
  Meta,
  Transferencia,
} from "@/lib/tipos";

export default async function ControlPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // metas, aportes, apartados, movimientos y transferencias ya vienen SOLO míos
  // por RLS; categorias y medios se filtran (sus políticas dejan leer de ambos)
  const [
    metas,
    aportes,
    apartados,
    categorias,
    medios,
    movimientos,
    transferencias,
  ] = await Promise.all([
    supabase
      .from("metas")
      .select("id, nombre, descripcion, objetivo")
      .order("created_at"),
    supabase
      .from("aportes")
      .select("id, meta_id, medio_id, monto, fecha")
      .order("created_at", { ascending: false }),
    supabase
      .from("apartados")
      .select("id, nombre, monto, mes, categoria_id, movimiento_id")
      .is("movimiento_id", null) // solo pendientes: lo pagado vive en Historial
      .order("created_at"),
    supabase
      .from("categorias")
      .select("id, nombre, color")
      .eq("user_id", auth.user.id)
      .order("created_at"),
    supabase
      .from("medios")
      .select("id, nombre, emoji, tipo, saldo_inicial")
      .eq("user_id", auth.user.id)
      .order("created_at"),
    // solo lo que el saldo necesita; lo "Sin medio" no se puede atribuir y se queda fuera
    supabase
      .from("movimientos")
      .select("tipo, monto, medio_id")
      .not("medio_id", "is", null),
    supabase
      .from("transferencias")
      .select("id, origen_id, destino_id, monto, fecha")
      .order("created_at", { ascending: false }),
  ]);

  const listaMedios = (medios.data ?? []).map((m): Medio => ({
    id: m.id,
    nombre: m.nombre,
    emoji: m.emoji,
    tipo: m.tipo ?? "",
    saldoInicial: m.saldo_inicial,
  }));
  const listaTransferencias = (transferencias.data ?? []).map(
    (t): Transferencia => ({
      id: t.id,
      origenId: t.origen_id,
      destinoId: t.destino_id,
      monto: t.monto,
      fecha: t.fecha,
    }),
  );
  const saldos = saldosPorMedio(
    listaMedios,
    (movimientos.data ?? []).map((v): MovimientoDeSaldo => ({
      tipo: v.tipo as MovimientoDeSaldo["tipo"],
      monto: v.monto,
      medioId: v.medio_id,
    })),
    listaTransferencias,
  );

  return (
    <ControlView
      apartados={(apartados.data ?? []).map((a): Apartado => ({
        id: a.id,
        nombre: a.nombre,
        monto: a.monto,
        mes: a.mes,
        categoriaId: a.categoria_id,
        movimientoId: a.movimiento_id,
      }))}
      categorias={(categorias.data ?? []) as Categoria[]}
      metas={(metas.data ?? []) as Meta[]}
      aportes={(aportes.data ?? []).map((a): Aporte => ({
        id: a.id,
        metaId: a.meta_id,
        medioId: a.medio_id ?? undefined,
        monto: a.monto,
        fecha: a.fecha,
      }))}
      medios={listaMedios}
      saldos={saldos}
      transferencias={listaTransferencias.slice(0, 10)} // la lista muestra solo las recientes; el saldo usa todas
    />
  );
}
