import { NavBar } from "@/components/nav-bar";
import { ToastProvider } from "@/components/toast";
import { PerfilesProvider, type PerfilHeader } from "@/components/perfiles-provider";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export default async function TabsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  const { data: perfiles } = await supabase
    .from("profiles")
    .select("id, nombre, inicial, color, avatar_url")
    .order("created_at");

  return (
    <ToastProvider>
      <PerfilesProvider
        miId={auth.user?.id ?? ""}
        perfiles={(perfiles ?? []).map(
          (p): PerfilHeader => ({
            id: p.id,
            nombre: p.nombre,
            inicial: p.inicial,
            color: p.color,
            avatarUrl: p.avatar_url ?? null,
          }),
        )}
      >
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
          <main className="flex flex-1 flex-col gap-3 px-[18px] pb-11 pt-[calc(env(safe-area-inset-top)+12px)]">
            {children}
          </main>
          <NavBar />
        </div>
      </PerfilesProvider>
    </ToastProvider>
  );
}
