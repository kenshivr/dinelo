"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import { Dialogo } from "@/components/dialogo";
import type { Categoria, Medio, Movimiento } from "@/lib/mock-data";

type Props = {
  movimiento: Movimiento;
  categorias: Categoria[];
  medios: Medio[];
  onGuardar: (editado: Movimiento) => void;
  onCerrar: () => void;
};

export function EditarDialogo({ movimiento, categorias, medios, onGuardar, onCerrar }: Props) {
  const [concepto, setConcepto] = useState(movimiento.concepto);
  const [monto, setMonto] = useState(String(movimiento.monto));
  const [categoriaId, setCategoriaId] = useState(movimiento.categoriaId ?? null);
  const [medioId, setMedioId] = useState(movimiento.medioId);
  const [medioAbierto, setMedioAbierto] = useState(false);
  const [fecha, setFecha] = useState(movimiento.fecha);

  const esGasto = movimiento.tipo === "gasto";
  const medio = medios.find((m) => m.id === medioId);
  const listo =
    concepto.trim() !== "" &&
    Number(monto) > 0 &&
    fecha !== "" &&
    (!esGasto || categoriaId !== null);

  function guardar() {
    onGuardar({
      ...movimiento,
      concepto: concepto.trim(),
      monto: Number(monto),
      medioId,
      fecha,
      ...(esGasto && categoriaId ? { categoriaId } : {}),
    });
  }

  return (
    <Dialogo titulo="Editar movimiento" onCerrar={onCerrar}>
      <span className="lbl">Concepto</span>
      <input
        className="nbs finput outline-none"
        value={concepto}
        onChange={(e) => setConcepto(e.target.value)}
      />

      <span className="lbl">Monto</span>
      <label className="nbs finput flex items-center gap-1">
        $
        <input
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={monto}
          onChange={(e) => setMonto(e.target.value.replace(/[^\d.]/g, ""))}
          inputMode="decimal"
        />
      </label>

      {esGasto && (
        <>
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
        </>
      )}

      <span className="lbl">Medio</span>
      <button
        className="nbs flex items-center justify-between px-3.5 py-3 text-sm font-extrabold"
        onClick={() => setMedioAbierto(!medioAbierto)}
      >
        <span>
          {medio?.emoji}&nbsp; {medio?.nombre}
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

      <span className="lbl">Fecha</span>
      <label className="nbs flex items-center gap-2 px-3.5 py-3 text-sm font-extrabold">
        📅
        <input
          type="date"
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </label>

      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button className="btn sm f-gg flex-1 disabled:opacity-60" disabled={!listo} onClick={guardar}>
          Guardar
        </button>
      </div>
    </Dialogo>
  );
}
