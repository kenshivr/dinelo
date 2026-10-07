"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fmtMonto } from "@/lib/formato";

// Demo de funcionalidad de la landing (1.2.0, odd/tasks/landing.md): la
// tarjeta "Registrar gasto" reconstruida con bloques y, al lado, un mini Dash.
// Elegir un concepto deja el monto puesto; registrar sube Gastos, baja Saldo
// y mueve la barra de su categoría. Todo vive en memoria del visitante.

type Categoria = "Comida" | "Transporte" | "Diversión";

const CONCEPTOS: readonly {
  nombre: string;
  emoji: string;
  monto: number;
  categoria: Categoria;
}[] = [
  { nombre: "Café", emoji: "☕", monto: 45, categoria: "Comida" },
  { nombre: "Camión", emoji: "🚌", monto: 12, categoria: "Transporte" },
  { nombre: "Cine", emoji: "🎬", monto: 180, categoria: "Diversión" },
];

// un mes típico: lo mismo que muestran las capturas del Dash
const INGRESOS = 10000;
const GASTOS_INICIALES: Record<Categoria, number> = {
  Comida: 860,
  Diversión: 450,
  Transporte: 200,
};
const FILL: Record<Categoria, string> = {
  Comida: "f-y",
  Diversión: "f-p",
  Transporte: "f-b",
};

export function LandingDemo() {
  const [gastos, setGastos] = useState(GASTOS_INICIALES);
  const [elegido, setElegido] = useState<number | null>(null);
  const [monto, setMonto] = useState("");
  const [aviso, setAviso] = useState("");

  const total = Object.values(gastos).reduce((a, b) => a + b, 0);
  const saldo = INGRESOS - total;
  const categorias = (Object.keys(gastos) as Categoria[]).sort(
    (a, b) => gastos[b] - gastos[a],
  );

  const elegir = (i: number) => {
    setElegido(i);
    setMonto(String(CONCEPTOS[i].monto));
  };

  const registrar = () => {
    const cantidad = Number(monto);
    if (elegido === null || !cantidad) return;
    const { nombre, categoria } = CONCEPTOS[elegido];
    setGastos((g) => ({ ...g, [categoria]: g[categoria] + cantidad }));
    setAviso(
      `Gasto registrado: ${nombre} −${fmtMonto(cantidad)} en ${categoria}`,
    );
    setElegido(null);
    setMonto("");
  };

  return (
    <div className="grid w-full gap-6 md:grid-cols-2 md:items-start md:gap-10">
      {/* la tarjeta de captura, como en la app: concepto, monto grande, chips */}
      <div className="nbs flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <b className="text-[17px] font-black">Registrar gasto</b>
          <span className="tag f-y size-7 text-[13px]">G</span>
        </div>

        <span className="text-[13px] font-black tracking-[0.1em] uppercase text-muted-foreground">
          Concepto
        </span>
        <div className="flex flex-wrap gap-2">
          {CONCEPTOS.map((c, i) => (
            <button
              key={c.nombre}
              type="button"
              className={cn("chip", elegido === i && "f-y")}
              onClick={() => elegir(i)}
            >
              {c.emoji} {c.nombre}
            </button>
          ))}
        </div>

        <span className="text-[13px] font-black tracking-[0.1em] uppercase text-muted-foreground">
          Monto
        </span>
        <label className="nbs flex items-center gap-2 px-4 py-3 text-[30px] font-black">
          <span className="text-muted-foreground">$</span>
          <input
            aria-label="Monto"
            inputMode="decimal"
            className="w-full min-w-0 bg-transparent outline-none"
            placeholder="0"
            value={monto}
            onChange={(e) => setMonto(e.target.value.replace(/[^\d.]/g, ""))}
          />
          <span className="text-[13px] font-black tracking-[0.1em] text-muted-foreground">
            MXN
          </span>
        </label>

        <button type="button" className="btn f-gg w-full" onClick={registrar}>
          Registrar gasto
        </button>
        <p
          role="status"
          className="min-h-[1.25rem] text-[13.5px] font-extrabold"
        >
          {aviso}
        </p>
      </div>

      {/* el mini Dash: los bloques sueltos de las piezas de redes */}
      <div
        data-testid="mini-dash"
        className="flex flex-col gap-4 md:sticky md:top-24"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="stat f-b">
            <span className="text-[13px] font-black tracking-[0.1em] uppercase">
              Ingresos
            </span>
            <div className="text-[24px] leading-tight font-black tabular-nums">
              {fmtMonto(INGRESOS)}
            </div>
          </div>
          <div className="stat f-p">
            <span className="text-[13px] font-black tracking-[0.1em] uppercase">
              Gastos
            </span>
            <div className="text-[24px] leading-tight font-black tabular-nums">
              {fmtMonto(total)}
            </div>
          </div>
        </div>
        <div className="stat f-gg -rotate-1 py-4">
          <span className="text-[13px] font-black tracking-[0.1em] uppercase">
            Saldo
          </span>
          <div className="text-[44px] leading-none font-black tracking-tight tabular-nums">
            {fmtMonto(saldo)}
          </div>
        </div>
        <div className="nbs flex flex-col gap-3 p-4">
          <b className="text-[14px] font-black">Por categoría</b>
          {categorias.map((c) => {
            const pct = Math.round((gastos[c] / total) * 100);
            return (
              <div key={c} data-categoria={c} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[13.5px] font-extrabold">
                  <span>{c}</span>
                  <span className="tabular-nums">
                    {pct}% · {fmtMonto(gastos[c])}
                  </span>
                </div>
                <div className="bfill overflow-hidden bg-background">
                  <div
                    className={cn("barra-demo h-full", FILL[c])}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
