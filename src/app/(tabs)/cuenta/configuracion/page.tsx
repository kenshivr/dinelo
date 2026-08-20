import { redirect } from "next/navigation";
import { ConfView, type Usos } from "@/components/conf/conf-view";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type { Categoria, Frecuente, Medio } from "@/lib/tipos";

export default async function ConfPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // App individual: las 3 listas son MÍAS (categorías y frecuentes migradas 2026-08-13).
  // Movimientos y aportes solo se cuentan: el aviso al borrar dice cuántos quedarían sin categoría/medio.
  const [categorias, medios, frecuentes, movs, aportes] = await Promise.all([
    supabase.from("categorias").select("id, nombre, color").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("medios").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("frecuentes").select("id, nombre, emoji, tipo").eq("user_id", auth.user.id).order("created_at"),
    supabase.from("movimientos").select("categoria_id, medio_id").eq("user_id", auth.user.id),
    supabase.from("aportes").select("medio_id").eq("user_id", auth.user.id),
  ]);

  const usos: Usos = { categorias: {}, medios: {}, aportes: {} };
  for (const m of movs.data ?? []) {
    if (m.categoria_id) usos.categorias[m.categoria_id] = (usos.categorias[m.categoria_id] ?? 0) + 1;
    if (m.medio_id) usos.medios[m.medio_id] = (usos.medios[m.medio_id] ?? 0) + 1;
  }
  for (const a of aportes.data ?? []) {
    if (a.medio_id) usos.aportes[a.medio_id] = (usos.aportes[a.medio_id] ?? 0) + 1;
  }

  return (
    <ConfView
      categorias={(categorias.data ?? []) as Categoria[]}
      medios={(medios.data ?? []).map((m): Medio => ({ ...m, tipo: m.tipo ?? "" }))}
      frecuentes={(frecuentes.data ?? []) as Frecuente[]}
      usos={usos}
    />
  );
}
