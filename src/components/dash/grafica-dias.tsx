"use client";

import { useState } from "react";
import { fechaDe } from "@/lib/fechas";
import { fmtMonto } from "@/lib/formato";

type Props = {
  valores: number[]; // un monto por día del mes, índice 0 = día 1
  color: string;
  mes: string; // yyyy-mm, para nombrar el día tocado
  vacio?: string;
};

const DETALLE = 15; // franja superior donde aparece el día seleccionado
const ALTO = 78; // alto del área de barras
const PASO = 11; // ancho reservado por día
const BARRA = 8; // ancho de barra (queda ~3px de aire entre días)

const formatoDia = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function GraficaDias({ valores, color, mes, vacio = "Sin movimientos" }: Props) {
  const [sel, setSel] = useState<number | null>(null);

  const ancho = valores.length * PASO;
  const mayor = Math.max(...valores);

  if (mayor === 0) {
    return <p className="py-4 text-center text-[11px] font-bold text-muted-foreground">{vacio}</p>;
  }

  const detalle =
    sel !== null && valores[sel] > 0
      ? `${formatoDia
          .format(fechaDe(`${mes}-${String(sel + 1).padStart(2, "0")}`))
          .replaceAll(",", "")
          .replace(".", "")} · ${fmtMonto(valores[sel])}`
      : "";

  return (
    <svg viewBox={`0 0 ${ancho} ${DETALLE + ALTO + 16}`} className="w-full" role="img">
      {detalle && (
        <text x={ancho / 2} y="10" textAnchor="middle" className="fill-foreground text-[10px] font-black">
          {detalle}
        </text>
      )}
      {valores.map((v, i) => {
        if (v === 0) return null;
        const alto = Math.max((v / mayor) * (ALTO - 4), 3);
        return (
          <rect
            key={i}
            x={i * PASO + (PASO - BARRA) / 2}
            y={DETALLE + ALTO - alto}
            width={BARRA}
            height={alto}
            rx="2"
            fill={sel === i ? "#facc15" : color}
            stroke="#111"
            strokeWidth="1.5"
          />
        );
      })}
      <line
        x1="0"
        y1={DETALLE + ALTO + 1}
        x2={ancho}
        y2={DETALLE + ALTO + 1}
        stroke="var(--border)"
        strokeWidth="2"
      />
      {valores.map((_, i) =>
        i === 0 || (i + 1) % 5 === 0 ? (
          <text
            key={i}
            x={i * PASO + PASO / 2}
            y={DETALLE + ALTO + 13}
            textAnchor="middle"
            className="fill-muted-foreground text-[8px] font-bold"
          >
            {i + 1}
          </text>
        ) : null,
      )}
      {/* zonas de toque: la columna COMPLETA del día, no solo la barra de 8px */}
      {valores.map((v, i) => (
        <rect
          key={i}
          x={i * PASO}
          y={0}
          width={PASO}
          height={DETALLE + ALTO}
          fill="transparent"
          className={v > 0 ? "cursor-pointer" : undefined}
          onClick={() => setSel(v > 0 && sel !== i ? i : null)}
        >
          {v > 0 && <title>{`día ${i + 1} · ${fmtMonto(v)}`}</title>}
        </rect>
      ))}
    </svg>
  );
}
