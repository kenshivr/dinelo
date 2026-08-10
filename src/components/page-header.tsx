"use client";

import type { ReactNode } from "react";
import { fechaDe, useHoy } from "@/lib/fechas";

const formatoHoy = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

type Props = {
  title: ReactNode;
  conFecha?: boolean;
  ambos?: boolean;
  sinAvatar?: boolean;
  derecha?: ReactNode;
};

export function PageHeader({ title, conFecha = false, ambos = false, sinAvatar = false, derecha }: Props) {
  const hoy = useHoy();
  const etiquetaHoy = hoy ? `Hoy · ${formatoHoy.format(fechaDe(hoy)).replaceAll(",", "")}` : "";

  return (
    <>
      <header className="flex items-center justify-between pt-1">
        <span className="text-[21px] font-black tracking-tighter">DiNelo</span>
        {sinAvatar ? null : ambos ? (
          <span className="flex gap-1.5">
            <span className="av sm f-y">B</span>
            <span className="av sm f-p">N</span>
          </span>
        ) : (
          <span className="av f-y">B</span>
        )}
      </header>
      <div className="flex items-baseline justify-between">
        <b className="text-lg font-black">{title}</b>
        {derecha ?? (conFecha && <span className="text-xs font-bold text-muted-foreground">{etiquetaHoy}</span>)}
      </div>
    </>
  );
}
