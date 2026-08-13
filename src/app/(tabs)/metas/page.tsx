import { redirect } from "next/navigation";
import { MetasView } from "@/components/metas/metas-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type { Aporte, Medio, Meta } from "@/lib/tipos";

export default async function MetasPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // metas y aportes ya vienen SOLO míos por RLS; medios se filtra (se leen de ambos)
  const [metas, aportes, medios] = await Promise.all([
    supabase.from("metas").select("id, nombre, descripcion, objetivo").order("created_at"),
    supabase.from("aportes").select("id, meta_id, medio_id, monto, fecha").order("created_at", { ascending: false }),
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
  ]);

  return (
    <MetasView
      metas={(metas.data ?? []) as Meta[]}
      aportes={(aportes.data ?? []).map(
        (a): Aporte => ({ id: a.id, metaId: a.meta_id, medioId: a.medio_id, monto: a.monto, fecha: a.fecha }),
      )}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
    />
  );
}
