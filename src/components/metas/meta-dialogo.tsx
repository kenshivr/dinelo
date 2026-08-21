"use client";

import { useState } from "react";
import { conComas, limpiarMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import type { Meta } from "@/lib/tipos";

type Props = {
  meta: Meta | null; // null = nueva
  onGuardar: (datos: { nombre: string; descripcion: string; objetivo: number }) => Promise<string | null>;
  onCerrar: () => void;
};

export function MetaDialogo({ meta, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(meta?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(meta?.descripcion ?? "");
  const [objetivo, setObjetivo] = useState(meta ? String(meta.objetivo) : "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nombre.trim() !== "" && Number(objetivo) > 0;

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      objetivo: Number(objetivo),
    });
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo titulo={meta ? "Editar meta" : "Nueva meta"} onCerrar={onCerrar}>
      <span className="lbl">Nombre</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Teléfono nuevo, Tenis, Carro…"
      />

      <span className="lbl">Descripción</span>
      <input
        className="nbs finput outline-none"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="¿Para qué es? (opcional)"
      />

      <span className="lbl">¿Cuánto hay que juntar?</span>
      <label className="nbs finput flex items-center gap-1">
        $
        <input
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={conComas(objetivo)}
          onChange={(e) => setObjetivo(limpiarMonto(e.target.value))}
          inputMode="decimal"
          placeholder="0"
        />
      </label>

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
