"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fechaDe, useHoy } from "@/lib/fechas";
import { usePerfiles, type PerfilHeader } from "@/components/perfiles-provider";

const formatoHoy = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

type Props = {
  title: ReactNode;
  conFecha?: boolean;
  derecha?: ReactNode;
};

// Siempre el usuario logueado, siempre al mismo tamaño (32px) en toda la app
function Avatar({ perfil }: { perfil: PerfilHeader }) {
  if (perfil.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- 32px; next/image pide config de dominio remoto
      <img src={perfil.avatarUrl} alt={perfil.nombre} className="av object-cover" />
    );
  }
  return <span className={cn("av", perfil.color)}>{perfil.inicial}</span>;
}

export function PageHeader({ title, conFecha = false, derecha }: Props) {
  const hoy = useHoy();
  const { mio } = usePerfiles();
  const etiquetaHoy = hoy ? `Hoy · ${formatoHoy.format(fechaDe(hoy)).replaceAll(",", "")}` : "";

  return (
    <>
      <header className="flex items-center justify-between pt-1">
        <span className="text-[21px] font-black tracking-tighter">DiNelo</span>
        {mio && <Avatar perfil={mio} />}
      </header>
      <div className="flex items-baseline justify-between">
        <b className="text-lg font-black">{title}</b>
        {derecha ?? (conFecha && <span className="text-xs font-bold text-muted-foreground">{etiquetaHoy}</span>)}
      </div>
    </>
  );
}
