"use client";

import { useEffect, useState } from "react";

const formatoHoy = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function PageHeader({ title, conFecha = false }: { title: string; conFecha?: boolean }) {
  const [hoy, setHoy] = useState("");

  useEffect(() => {
    setHoy(`Hoy · ${formatoHoy.format(new Date()).replaceAll(",", "")}`);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between pt-1">
        <span className="text-[21px] font-black tracking-tighter">DiNelo</span>
        <span className="av f-y">B</span>
      </header>
      <div className="flex items-baseline justify-between">
        <b className="text-lg font-black">{title}</b>
        {conFecha && <span className="text-xs font-bold text-muted-foreground">{hoy}</span>}
      </div>
    </>
  );
}
