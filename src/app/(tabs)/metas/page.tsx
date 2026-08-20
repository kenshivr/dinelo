import { redirect } from "next/navigation";
import { ControlView } from "@/components/control/control-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type { Apartado, Aporte, Categoria, Medio, Meta } from "@/lib/tipos";

export default async function ControlPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // metas, aportes y apartados ya vienen SOLO míos por RLS;
  // categorias y medios se filtran (sus políticas dejan leer de ambos)
  const [metas, aportes, apartados, categorias, medios] = await Promise.all([
    supabase.from("metas").select("id, nombre, descripcion, objetivo").order("created_at"),
    supabase.from("aportes").select("id, meta_id, medio_id, monto, fecha").order("created_at", { ascending: false }),
    supabase
      .from("apartados")
      .select("id, nombre, monto, mes, categoria_id, movimiento_id")
      .is("movimiento_id", null) // solo pendientes: lo pagado vive en Historial
      .order("created_at"),
    supabase.from("categorias").select("id, nombre, color").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
  ]);

  return (
    <ControlView
      apartados={(apartados.data ?? []).map(
        (a): Apartado => ({
          id: a.id,
          nombre: a.nombre,
          monto: a.monto,
          mes: a.mes,
          categoriaId: a.categoria_id,
          movimientoId: a.movimiento_id,
        }),
      )}
      categorias={(categorias.data ?? []) as Categoria[]}
      metas={(metas.data ?? []) as Meta[]}
      aportes={(aportes.data ?? []).map(
        (a): Aporte => ({ id: a.id, metaId: a.meta_id, medioId: a.medio_id ?? undefined, monto: a.monto, fecha: a.fecha }),
      )}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
    />
  );
}
