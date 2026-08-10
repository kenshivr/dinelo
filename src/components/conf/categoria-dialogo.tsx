"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialogo } from "@/components/dialogo";
import type { Categoria, ColorBloque } from "@/lib/mock-data";

type Props = {
  categoria: Categoria | null; // null = nueva
  onGuardar: (categoria: Categoria) => void;
  onCerrar: () => void;
};

// mismo orden que los swatches del mock
const COLORES: ColorBloque[] = ["f-p", "f-y", "f-b", "f-gg", "f-r", "f-g"];

export function CategoriaDialogo({ categoria, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [color, setColor] = useState<ColorBloque>(categoria?.color ?? "f-y");

  const listo = nombre.trim() !== "";

  function guardar() {
    onGuardar({ id: categoria?.id ?? crypto.randomUUID(), nombre: nombre.trim(), color });
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
