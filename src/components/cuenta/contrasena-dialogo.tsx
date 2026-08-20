"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";
import { ParContrasenas, contrasenaLista } from "@/components/captura/par-contrasenas";

type Props = {
  onGuardar: (nueva: string) => Promise<string | null>;
  onCerrar: () => void;
};

export function ContrasenaDialogo({ onGuardar, onCerrar }: Props) {
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = contrasenaLista(nueva, repetida);

  async function guardar() {
    if (!listo || guardando) return;
    setGuardando(true);
    setError(null);
    const e = await onGuardar(nueva);
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo titulo="Cambiar contraseña" onCerrar={onCerrar}>
      <ParContrasenas nueva={nueva} repetida={repetida} onNueva={setNueva} onRepetida={setRepetida} />

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
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </Dialogo>
  );
}
