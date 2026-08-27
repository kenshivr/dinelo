"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import { conComas, limpiarMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import type { Categoria, Medio, Movimiento } from "@/lib/tipos";

type Props = {
  movimiento: Movimiento;
  categorias: Categoria[];
  medios: Medio[];
  onGuardar: (editado: Movimiento) => Promise<string | null>;
  onCerrar: () => void;
};

export function EditarDialogo({
  movimiento,
  categorias,
  medios,
  onGuardar,
  onCerrar,
}: Props) {
  const [concepto, setConcepto] = useState(movimiento.concepto);
  const [monto, setMonto] = useState(String(movimiento.monto));
  const [categoriaId, setCategoriaId] = useState(
    movimiento.categoriaId ?? null,
  );
  const [medioId, setMedioId] = useState(movimiento.medioId ?? null);
  const [medioAbierto, setMedioAbierto] = useState(false);
  const [fecha, setFecha] = useState(movimiento.fecha);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esGasto = movimiento.tipo === "gasto";
  const medio = medios.find((m) => m.id === medioId);
  const listo = concepto.trim() !== "" && Number(monto) > 0 && fecha !== "";

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar({
      ...movimiento,
      concepto: concepto.trim(),
      monto: Number(monto),
      fecha,
      // explícitos (no spread condicional): quitar categoría o medio debe borrarlos de verdad
      medioId: medioId ?? undefined,
      categoriaId: esGasto && categoriaId ? categoriaId : undefined,
    });
    if (e) {
      setError(e);
      setGuardando(false);
    }
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
          value={conComas(monto)}
          onChange={(e) => setMonto(limpiarMonto(e.target.value))}
          inputMode="decimal"
        />
      </label>

      {esGasto && (
        <>
          <span className="lbl">Categoría · opcional</span>
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c.id}
                className={cn("chip", categoriaId === c.id && "f-y")}
                onClick={() =>
                  setCategoriaId(categoriaId === c.id ? null : c.id)
                }
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </>
      )}

      <span className="lbl">Medio · opcional</span>
      <button
        className="nbs flex items-center justify-between px-3.5 py-3 text-sm font-extrabold"
        onClick={() => setMedioAbierto(!medioAbierto)}
      >
        <span className={cn(!medio && "text-muted-foreground")}>
          {medio ? `${medio.emoji}  ${medio.nombre}` : "Sin medio"}
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
                // tocar el elegido lo quita: vuelve a "Sin medio"
                setMedioId(medioId === m.id ? null : m.id);
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

      {error && (
        <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
          {error}
        </div>
      )}

      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button
          className="btn sm f-gg flex-1 disabled:opacity-60"
          disabled={!listo || guardando}
          onClick={guardar}
        >
          Guardar
        </button>
      </div>
    </Dialogo>
  );
}
