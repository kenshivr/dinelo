"use client";

import { Dialogo } from "@/components/dialogo";

type Props = {
  titulo: string;
  resumen: string;
  onBorrar: () => void;
  onCerrar: () => void;
};

export function ConfirmarBorrado({ titulo, resumen, onBorrar, onCerrar }: Props) {
  return (
    <Dialogo titulo={titulo} onCerrar={onCerrar}>
      <div className="nbs finput opacity-85">{resumen}</div>
      <span className="text-xs font-bold leading-relaxed text-muted-foreground">
        Esta acción no se puede deshacer.
      </span>
      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button className="btn sm f-r flex-1" onClick={onBorrar}>
          Borrar
        </button>
      </div>
    </Dialogo>
  );
}
