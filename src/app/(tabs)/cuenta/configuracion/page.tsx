import { redirect } from "next/navigation";
import { ConfView } from "@/components/conf/conf-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type { Categoria, Frecuente, Medio } from "@/lib/tipos";

export default async function ConfPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // App individual: las 3 listas son MÍAS (categorías y frecuentes migradas 2026-08-13)
  const [categorias, medios, frecuentes] = await Promise.all([
    supabase.from("categorias").select("id, nombre, color").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("frecuentes").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
  ]);

  return (
    <ConfView
      categorias={(categorias.data ?? []) as Categoria[]}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
      frecuentes={(frecuentes.data ?? []) as Frecuente[]}
    />
  );
}
