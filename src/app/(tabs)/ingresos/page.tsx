import { redirect } from "next/navigation";
import { IngresosForm } from "@/components/ingresos/ingresos-form";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type { Frecuente, Medio } from "@/lib/tipos";

export default async function IngresosPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const [medios, frecuentes] = await Promise.all([
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
    supabase
      .from("frecuentes")
      .select("id, nombre, emoji, tipo")
      .eq("user_id", auth.user.id)
      .eq("tipo", "I")
      .order("created_at"),
  ]);

  return (
    <IngresosForm
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
      frecuentes={(frecuentes.data ?? []) as Frecuente[]}
    />
  );
}
