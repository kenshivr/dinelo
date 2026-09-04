"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fmtMonto } from "@/lib/formato";
import { ChipCategoria } from "@/components/captura/chip-categoria";
import { Dialogo } from "@/components/dialogo";
import type { Apartado, Categoria, Medio } from "@/lib/tipos";

type Props = {
  apartado: Apartado;
  categorias: Categoria[];
  medios: Medio[];
  onPagar: (datos: {
    medioId: string | null;
    categoriaId: string | null;
  }) => Promise<string | null>;
  onCerrar: () => void;
};

// Mismas reglas que la captura de Gastos: categoría y medio opcionales
// (sin elegir → "Sin categoría" / "Sin medio").
export function PagarDialogo({
  apartado,
  categorias,
  medios,
  onPagar,
  onCerrar,
}: Props) {
  const [categoriaId, setCategoriaId] = useState<string | null>(
    apartado.categoriaId,
  );
  const [medioId, setMedioId] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pagar() {
    if (pagando) return;
    setPagando(true);
    setError(null);
    const e = await onPagar({ medioId, categoriaId });
    if (e) {
      setError(e);
      setPagando(false);
    }
  }

  return (
    <Dialogo titulo={`Pagar ${apartado.nombre}`} onCerrar={onCerrar}>
      <div className="nbs px-3.5 py-3 text-center">
        <b className="block text-[21px] font-black tracking-tight">
          {fmtMonto(apartado.monto)}
        </b>
        <span className="text-[10.5px] font-bold text-muted-foreground">
          se registra como gasto con la fecha de hoy
        </span>
      </div>

      <span className="lbl">Categoría · opcional</span>
      {categorias.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <ChipCategoria
              key={c.id}
              categoria={c}
              activa={categoriaId === c.id}
              onClick={() => setCategoriaId(categoriaId === c.id ? null : c.id)}
            />
          ))}
        </div>
      ) : (
        <span className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Sin categorías todavía — irá a Sin categoría
        </span>
      )}

      <span className="lbl">¿De dónde salió? · opcional</span>
      {medios.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {medios.map((m) => (
            <button
              key={m.id}
              className={cn("chip", medioId === m.id && "f-y")}
              onClick={() => setMedioId(medioId === m.id ? null : m.id)}
            >
              {m.emoji} {m.nombre}
            </button>
          ))}
        </div>
      ) : (
        <span className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Sin medios todavía — irá sin medio
        </span>
      )}

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
          disabled={pagando}
          onClick={pagar}
        >
          {pagando ? "Registrando…" : "✓ Ya lo pagué"}
        </button>
      </div>
    </Dialogo>
  );
}
