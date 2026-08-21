"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { conComas, limpiarMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import type { Apartado, Categoria } from "@/lib/tipos";

type Props = {
  apartado: Apartado | null; // null = nuevo
  categorias: Categoria[];
  onGuardar: (datos: { nombre: string; monto: number; categoriaId: string | null }) => Promise<string | null>;
  onCerrar: () => void;
};

export function ApartadoDialogo({ apartado, categorias, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(apartado?.nombre ?? "");
  const [monto, setMonto] = useState(apartado ? String(apartado.monto) : "");
  const [categoriaId, setCategoriaId] = useState<string | null>(apartado?.categoriaId ?? null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nombre.trim() !== "" && Number(monto) > 0;

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar({ nombre: nombre.trim(), monto: Number(monto), categoriaId });
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo titulo={apartado ? "Editar apartado" : "Nuevo apartado"} onCerrar={onCerrar}>
      <span className="lbl">¿Para qué es?</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Renta"
      />

      <span className="lbl">¿Cuánto apartas?</span>
      <label className="nbs finput flex items-center gap-1">
        $
        <input
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={conComas(monto)}
          onChange={(e) => setMonto(limpiarMonto(e.target.value))}
          inputMode="decimal"
          placeholder="0"
        />
      </label>

      {categorias.length > 0 && (
        <>
          <span className="lbl">Categoría · opcional</span>
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c.id}
                className={cn("chip", categoriaId === c.id && "f-y")}
                onClick={() => setCategoriaId(categoriaId === c.id ? null : c.id)}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </>
      )}

      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}

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
