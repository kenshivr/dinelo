"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import type { Categoria, Frecuente, Medio } from "@/lib/mock-data";

const chevron = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

type Props = {
  categorias: Categoria[];
  medios: Medio[];
  frecuentes: Frecuente[];
};

export function GastosForm({ categorias, medios, frecuentes }: Props) {
  const [concepto, setConcepto] = useState("");
  const [conceptoAbierto, setConceptoAbierto] = useState(false);
  const [monto, setMonto] = useState("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [medioId, setMedioId] = useState<string | null>(null);
  const [medioAbierto, setMedioAbierto] = useState(false);

  const medio = medios.find((m) => m.id === medioId);
  const listo = concepto.trim() !== "" && monto !== "" && categoriaId !== null && medioId !== null;

  function registrar() {
    // Fase 2: server action → Supabase. Por ahora solo limpia el formulario.
    console.log("movimiento", { tipo: "gasto", concepto, monto, categoriaId, medioId });
    setConcepto("");
    setMonto("");
    setCategoriaId(null);
    setMedioId(null);
  }

  return (
    <>
      <PageHeader title="Registrar gasto" conFecha />

      <div className="nbs flex items-center justify-between px-3.5">
        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          onFocus={() => setConceptoAbierto(true)}
          placeholder="¿En qué gastaste?"
          className="w-full bg-transparent py-3 text-sm font-extrabold outline-none placeholder:text-muted-foreground"
        />
        {chevron}
      </div>

      {conceptoAbierto && (
        <div className="nbs p-[7px]">
          {frecuentes.map((f) => (
            <button
              key={f.id}
              className={cn("drow", concepto === f.nombre && "on")}
              onClick={() => {
                setConcepto(f.nombre);
                setConceptoAbierto(false);
              }}
            >
              {f.emoji} {f.nombre}
            </button>
          ))}
          <button className="drow text-muted-foreground" onClick={() => setConceptoAbierto(false)}>
            ✏️ escribí uno nuevo…
          </button>
        </div>
      )}

      <label className="block pt-1 text-center">
        <span className="flex items-baseline justify-center text-5xl font-black tracking-tight">
          $&nbsp;
          <input
            value={monto}
            onChange={(e) => setMonto(e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
            placeholder="0"
            style={{ width: `${Math.max(monto.length, 1)}ch` }}
            className="bg-transparent text-5xl font-black tracking-tight outline-none placeholder:text-muted-foreground"
          />
        </span>
        <span className="lbl mt-1 block tracking-[0.24em]">MXN</span>
      </label>

      <span className="lbl">Categoría</span>
      <div className="flex flex-wrap gap-2">
        {categorias.map((c) => (
          <button
            key={c.id}
            className={cn("chip", categoriaId === c.id && "f-y")}
            onClick={() => setCategoriaId(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      <span className="lbl">¿De dónde salió?</span>
      <button
        className="nbs flex items-center justify-between px-3.5 py-3 text-sm font-extrabold"
        onClick={() => setMedioAbierto(!medioAbierto)}
      >
        <span className={cn(!medio && "text-muted-foreground")}>
          {medio ? `${medio.emoji}  ${medio.nombre}` : "Elegí un medio"}
        </span>
        {chevron}
      </button>

      {medioAbierto && (
        <div className="nbs p-[7px]">
          {medios.map((m) => (
            <button
              key={m.id}
              className={cn("drow", medioId === m.id && "on")}
              onClick={() => {
                setMedioId(m.id);
                setMedioAbierto(false);
              }}
            >
              {m.emoji} {m.nombre}
            </button>
          ))}
        </div>
      )}

      <button className="dock f-gg -mx-[18px] mt-auto disabled:opacity-60" disabled={!listo} onClick={registrar}>
        Registrar gasto
      </button>
    </>
  );
}
