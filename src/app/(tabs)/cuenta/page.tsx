import Link from "next/link";
import { cn } from "@/lib/utils";
import { chevronDer } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { perfiles } from "@/lib/mock-data";
import { salir } from "./acciones";

export default function CuentaPage() {
  const perfil = perfiles[0]; // fase 2: el usuario logueado

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
            miembro desde {perfil.desde}
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
          <span className="text-[10.5px] font-bold text-muted-foreground">{perfil.email}</span>
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
