"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialogo } from "@/components/dialogo";
import type { Categoria, ColorBloque } from "@/lib/tipos";

type Props = {
  categoria: Categoria | null; // null = nueva
  onGuardar: (datos: { nombre: string; color: ColorBloque }) => Promise<string | null>;
  onCerrar: () => void;
};

// mismo orden que los swatches del mock
const COLORES: ColorBloque[] = ["f-p", "f-y", "f-b", "f-gg", "f-r", "f-g"];

export function CategoriaDialogo({ categoria, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [color, setColor] = useState<ColorBloque>(categoria?.color ?? "f-y");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nombre.trim() !== "";

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar({ nombre: nombre.trim(), color });
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo titulo={categoria ? "Editar categoría" : "Nueva categoría"} onCerrar={onCerrar}>
      <span className="lbl">Nombre</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="¿Cómo se llama?"
      />

      <span className="lbl">Color</span>
      <div className="flex flex-wrap gap-2.5">
        {COLORES.map((c) => (
          <button key={c} className={cn("sw2", c)} onClick={() => setColor(c)}>
            {color === c && "✓"}
          </button>
        ))}
      </div>

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
