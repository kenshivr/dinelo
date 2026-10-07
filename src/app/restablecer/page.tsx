import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { RestablecerForm } from "@/components/restablecer-form";
import { Logo } from "@/components/logo";

// Se llega desde el enlace del correo (/auth/confirm deja la sesión de recovery)
export default async function RestablecerPage() {
  const supabase = await crearClienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-[18px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-[calc(env(safe-area-inset-top)+12px)]">
      <div className="mt-11 mb-4 flex flex-col items-center gap-2.5">
        <Logo />
        <span className="text-xs font-bold text-muted-foreground">
          contraseña nueva
        </span>
      </div>

      <RestablecerForm />
    </main>
  );
}
