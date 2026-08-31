import { NavBar } from "@/components/nav-bar";
import { TabsMain } from "@/components/tabs-main";
import { ToastProvider } from "@/components/toast";
import {
  PerfilesProvider,
  type PerfilHeader,
} from "@/components/perfiles-provider";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export default async function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  // App individual: solo MI perfil (el header no muestra a nadie más)
  const { data: perfiles } = await supabase
    .from("profiles")
    .select("id, nombre, inicial, color, avatar_url")
    .eq("id", auth.user?.id ?? "");

  return (
    <ToastProvider>
      <PerfilesProvider
        miId={auth.user?.id ?? ""}
        perfiles={(perfiles ?? []).map((p): PerfilHeader => ({
          id: p.id,
          nombre: p.nombre,
          inicial: p.inicial,
          color: p.color,
          avatarUrl: p.avatar_url ?? null,
        }))}
      >
        {/* marco fijo con inset-0 (no h-dvh): al recargar en Android, dvh puede
            medir ~50px de más y el dock del main queda hundido tras el navbar;
            fixed estira al viewport real sin depender de la unidad. El que
            scrollea sigue siendo el main, no el document. */}
        <div className="fixed inset-0 mx-auto flex w-full max-w-md flex-col">
          <TabsMain>{children}</TabsMain>
          <NavBar />
        </div>
      </PerfilesProvider>
    </ToastProvider>
  );
}
