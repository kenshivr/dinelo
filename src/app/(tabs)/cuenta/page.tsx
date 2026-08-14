import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { chevronDer } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { MisDatos } from "@/components/cuenta/mis-datos";
import { CambiarFoto } from "@/components/cuenta/cambiar-foto";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { salir } from "./acciones";

const formatoDesde = new Intl.DateTimeFormat("es-MX", { month: "short", year: "numeric" });

export default async function CuentaPage() {
  const supabase = await crearClienteServidor();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: perfil } = await supabase
    .from("profiles")
    .select("nombre, inicial, color, avatar_url, created_at")
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
        {perfil.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- 46px; next/image pide config de dominio remoto
          <img src={perfil.avatar_url} alt="tu foto" className="av big object-cover" />
        ) : (
          <span className={cn("av big", perfil.color)}>{perfil.inicial}</span>
        )}
        <span className="min-w-0 flex-1">
          <b className="block text-[15.5px] font-black">{perfil.nombre}</b>
          <span className="text-[11px] font-bold text-muted-foreground">
            miembro desde {desde}
          </span>
        </span>
        <CambiarFoto />
      </div>

      <span className="lbl">Mis datos</span>
      <MisDatos email={auth.user.email ?? ""} />

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

      <span className="lbl">Ajustes</span>
      <Link href="/cuenta/configuracion" className="nbs crow">
        <span className="text-[17px]">⚙️</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">Configuración</b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            categorías, medios, frecuentes y tema
          </span>
        </span>
        {chevronDer}
      </Link>

      {/* contents: el dock debe ser hijo directo del main (flex) para que
          mt-auto y su sticky funcionen; el form no genera caja propia */}
      <form action={salir} className="contents">
        <button className="dock -mx-[18px] mt-auto text-negative">Cerrar sesión</button>
      </form>
    </>
  );
}
