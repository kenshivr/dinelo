"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";

type Props = {
  actual: string;
  onGuardar: (nuevo: string) => Promise<string | null>;
  onCerrar: () => void;
};

export function CorreoDialogo({ actual, onGuardar, onCerrar }: Props) {
  const [nuevo, setNuevo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const listo = /.+@.+\..+/.test(nuevo) && nuevo !== actual;

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar(nuevo);
    if (e) {
      setError(e);
      setGuardando(false);
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <Dialogo titulo="Revisa tu correo" onCerrar={onCerrar}>
        <span className="text-xs font-bold leading-relaxed text-muted-foreground">
          Te mandamos un enlace a <b className="text-foreground">{nuevo}</b> y
          otro a tu correo actual. El cambio se aplica cuando confirmes desde
          los dos.
        </span>
        <button className="btn sm f-y" onClick={onCerrar}>
          Entendido
        </button>
      </Dialogo>
    );
  }

  return (
    <Dialogo titulo="Cambiar correo" onCerrar={onCerrar}>
      <span className="lbl">Correo actual</span>
      <div className="nbs finput opacity-85">{actual}</div>

      <span className="lbl">Correo nuevo</span>
      <input
        className="nbs finput outline-none"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={nuevo}
        onChange={(e) => setNuevo(e.target.value.trim())}
        placeholder="nuevo@correo.com"
      />

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
