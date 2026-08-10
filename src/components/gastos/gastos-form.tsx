"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ConceptoCombobox } from "@/components/captura/concepto-combobox";
import { MontoInput } from "@/components/captura/monto-input";
import type { Categoria, Frecuente, Medio } from "@/lib/mock-data";

type Props = {
  categorias: Categoria[];
  medios: Medio[];
  frecuentes: Frecuente[];
};

export function GastosForm({ categorias, medios, frecuentes }: Props) {
  const [concepto, setConcepto] = useState("");
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

      <ConceptoCombobox
        value={concepto}
        onChange={setConcepto}
        frecuentes={frecuentes}
        placeholder="¿En qué gastaste?"
      />

      <MontoInput value={monto} onChange={setMonto} />

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
          {medio ? `${medio.emoji}  ${medio.nombre}` : "Elegí un medio"}
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
