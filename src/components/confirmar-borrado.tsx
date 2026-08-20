"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";

type Props = {
  titulo: string;
  resumen: string;
  // Consecuencia que el usuario debe saber antes de borrar (p. ej. "12 gastos pasarán a Sin categoría").
  aviso?: string;
  // Puede devolver un mensaje de error para mostrar (p. ej. el restrict de Supabase).
  onBorrar: () => void | Promise<string | null | void>;
  onCerrar: () => void;
};

export function ConfirmarBorrado({ titulo, resumen, aviso, onBorrar, onCerrar }: Props) {
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function borrar() {
    setBorrando(true);
    const e = await onBorrar();
    if (typeof e === "string") {
      setError(e);
      setBorrando(false);
    }
  }

  return (
    <Dialogo titulo={titulo} onCerrar={onCerrar}>
      <div className="nbs finput opacity-85">{resumen}</div>
      {aviso && <div className="nbs f-y px-3.5 py-2.5 text-xs font-extrabold">{aviso}</div>}
      <span className="text-xs font-bold leading-relaxed text-muted-foreground">
        Esta acción no se puede deshacer.
      </span>
      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}
      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button className="btn sm f-r flex-1 disabled:opacity-60" disabled={borrando} onClick={borrar}>
          Borrar
        </button>
      </div>
    </Dialogo>
  );
}
