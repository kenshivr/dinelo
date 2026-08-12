"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";

type Props = {
  onGuardar: (nueva: string) => Promise<string | null>;
  onCerrar: () => void;
};

export function ContrasenaDialogo({ onGuardar, onCerrar }: Props) {
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nueva.length >= 6 && nueva === repetida;

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar(nueva);
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo titulo="Cambiar contraseña" onCerrar={onCerrar}>
      <span className="lbl">Nueva contraseña</span>
      <input
        className="nbs finput outline-none"
        type="password"
        value={nueva}
        onChange={(e) => setNueva(e.target.value)}
        placeholder="mínimo 6 caracteres"
        autoComplete="new-password"
      />

      <span className="lbl">Repetila</span>
      <input
        className="nbs finput outline-none"
        type="password"
        value={repetida}
        onChange={(e) => setRepetida(e.target.value)}
        placeholder="otra vez, para confirmar"
        autoComplete="new-password"
      />
      {repetida !== "" && nueva !== repetida && (
        <span className="text-xs font-bold text-negative">Todavía no coinciden</span>
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
