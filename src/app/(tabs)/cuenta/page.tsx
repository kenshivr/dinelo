import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { chevronDer } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { salir } from "./acciones";

const formatoDesde = new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" });

export default async function CuentaPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("nombre, inicial, color, created_at")
    .eq("id", auth.user.id)
    .single();
  if (!perfil) redirect("/login"); // sin perfil sembrado no hay cuenta que mostrar

  const desde = formatoDesde
    .format(new Date(perfil.created_at))
    .replaceAll(".", "")
    .replace(" de ", " ");

  return (
    <>
      <PageHeader
        title="Cuenta"
        derecha={<span className="text-xs font-bold text-muted-foreground">tu perfil</span>}
      />

      <div className="nbs crow px-3.5 py-3">
        <span className={cn("av big", perfil.color)}>{perfil.inicial}</span>
        <span className="min-w-0 flex-1">
          <b className="block text-[15.5px] font-black">{perfil.nombre}</b>
          <span className="text-[11px] font-bold text-muted-foreground">
            miembro desde {desde}
          </span>
        </span>
        <button className="rounded-lg border-2 bg-card px-[11px] py-[7px] text-[11px] font-extrabold shadow-[2px_2px_0_var(--sh)]">
          📷 Cambiar foto
        </button>
      </div>

      <span className="lbl">Mis datos</span>
      <button className="nbs crow text-left">
        <span className="text-[17px]">✉️</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">Correo</b>
          <span className="text-[10.5px] font-bold text-muted-foreground">{auth.user.email}</span>
        </span>
        {chevronDer}
      </button>
      <button className="nbs crow text-left">
        <span className="text-[17px]">🔒</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">Contraseña</b>
          <span className="text-[10.5px] font-bold text-muted-foreground">•••••••••</span>
        </span>
        {chevronDer}
      </button>

      <span className="lbl">Movimientos</span>
      <Link href="/cuenta/historial" className="nbs crow">
        <span className="text-[17px]">📒</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">Historial</b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            ver, editar o borrar tus registros
          </span>
        </span>
        {chevronDer}
      </Link>

      <form action={salir} className="-mx-[18px] mt-auto">
        <button className="dock w-full text-negative">Cerrar sesión</button>
      </form>
    </>
  );
}
