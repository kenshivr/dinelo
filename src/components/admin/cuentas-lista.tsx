"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EliminarCuentaAdmin } from "@/components/admin/eliminar-cuenta-admin";
import type { CuentaInforme } from "@/components/admin/informe-view";

// Lista de cuentas del informe — cliente por el toggle de orden:
// recientes = alta más nueva primero (default) · uso = más movimientos primero.

type Orden = "recientes" | "uso";

const fmtMes = new Intl.DateTimeFormat("es-MX", {
  month: "short",
  year: "numeric",
});
const fmtDia = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

// misma limpieza de "ago. de 2026" que en el resto del informe
function etiquetaMes(mes: string) {
  return fmtMes
    .format(new Date(`${mes}-15T00:00:00`))
    .replaceAll(".", "")
    .replace(" de ", " ");
}

function etiquetaDia(fecha: string) {
  return fmtDia.format(new Date(`${fecha}T00:00:00`)).replaceAll(".", "");
}

export function CuentasLista({ cuentas }: { cuentas: CuentaInforme[] }) {
  const [orden, setOrden] = useState<Orden>("recientes");

  // uso = movs desc; recientes (y empates de uso) = alta desc
  const ordenadas = [...cuentas].sort((a, b) =>
    orden === "uso" && a.movs !== b.movs
      ? b.movs - a.movs
      : b.desde.localeCompare(a.desde),
  );

  return (
    <>
      <div className="flex gap-2">
        {(
          [
            ["recientes", "Recientes"],
            ["uso", "Más uso"],
          ] as const
        ).map(([valor, label]) => (
          <button
            key={valor}
            className={cn("chip", orden === valor && "f-y")}
            onClick={() => setOrden(valor)}
          >
            {label}
          </button>
        ))}
      </div>

      {ordenadas.map((c) => (
        <div key={c.id} className="nbs px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            {c.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- 32px; next/image pide config de dominio remoto
              <img src={c.avatarUrl} alt="" className="av object-cover" />
            ) : (
              <span className={cn("av", c.color)}>{c.inicial}</span>
            )}
            <span className="min-w-0 flex-1">
              <b className="flex items-center gap-1.5 text-[13.5px] font-black">
                <span className="truncate">{c.nombre}</span>
                {c.esAdmin && (
                  <span className="f-y shrink-0 rounded-md border-2 border-[#111] px-1.5 text-[8.5px] font-black">
                    ADMIN
                  </span>
                )}
              </b>
              <span className="block truncate text-[10.5px] font-bold text-muted-foreground">
                {c.email}
              </span>
            </span>
            {!c.esAdmin && (
              <EliminarCuentaAdmin
                id={c.id}
                nombre={c.nombre}
                email={c.email}
              />
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10.5px] font-bold text-muted-foreground">
            <span>📒 {c.movs} movs</span>
            <span>🎯 {c.metas} metas</span>
            <span>📦 {c.apartados} apartados</span>
            <span>💳 {c.medios} medios</span>
          </div>
          <div className="mt-1 text-[10.5px] font-bold text-muted-foreground">
            desde {etiquetaMes(c.desde.slice(0, 7))} ·{" "}
            {c.ultimoMov
              ? `último registro ${etiquetaDia(c.ultimoMov)}`
              : "sin registros"}
          </div>
        </div>
      ))}
    </>
  );
}
