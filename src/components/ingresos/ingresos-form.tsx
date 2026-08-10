"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ConceptoCombobox } from "@/components/captura/concepto-combobox";
import { MontoInput } from "@/components/captura/monto-input";
import type { Frecuente, Medio } from "@/lib/mock-data";

type Props = {
  medios: Medio[];
  frecuentes: Frecuente[];
};

export function IngresosForm({ medios, frecuentes }: Props) {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [medioId, setMedioId] = useState<string | null>(null);

  const listo = concepto.trim() !== "" && monto !== "" && medioId !== null;

  function registrar() {
    // Fase 2: server action → Supabase. Por ahora solo limpia el formulario.
    console.log("movimiento", { tipo: "ingreso", concepto, monto, medioId });
    setConcepto("");
    setMonto("");
    setMedioId(null);
  }

  return (
    <>
      <PageHeader title="Registrar ingreso" conFecha />

      <ConceptoCombobox
        value={concepto}
        onChange={setConcepto}
        frecuentes={frecuentes}
        placeholder="¿De dónde llegó?"
      />

      <MontoInput value={monto} onChange={setMonto} />

      <span className="lbl">¿A dónde entra?</span>
      <div className="flex flex-wrap gap-2">
        {medios.map((m) => (
          <button
            key={m.id}
            className={cn("chip", medioId === m.id && "f-y")}
            onClick={() => setMedioId(m.id)}
          >
            {m.emoji} {m.nombre}
          </button>
        ))}
      </div>

      <button className="dock f-gg -mx-[18px] mt-auto disabled:opacity-60" disabled={!listo} onClick={registrar}>
        Registrar ingreso
      </button>
    </>
  );
}
