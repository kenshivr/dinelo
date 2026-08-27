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
        {/* marco fijo (h-dvh): el que scrollea es el main, no el document —
            así el dock y el navbar no se despegan con el viewport dinámico móvil */}
        <div className="mx-auto flex h-dvh w-full max-w-md flex-col">
          <TabsMain>{children}</TabsMain>
          <NavBar />
        </div>
      </PerfilesProvider>
    </ToastProvider>
  );
}
