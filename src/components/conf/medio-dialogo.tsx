"use client";

import { useState } from "react";
import { conComas, limpiarMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import { SelectorEmoji } from "@/components/selector-emoji";
import type { Medio } from "@/lib/tipos";

type Props = {
  medio: Medio | null; // null = nuevo
  onGuardar: (datos: {
    nombre: string;
    emoji: string;
    tipo: string;
    saldoInicial: number;
  }) => Promise<string | null>;
  onCerrar: () => void;
};

export function MedioDialogo({ medio, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(medio?.nombre ?? "");
  const [emoji, setEmoji] = useState(medio?.emoji ?? "");
  const [tipo, setTipo] = useState(medio?.tipo ?? "");
  const [saldoInicial, setSaldoInicial] = useState(
    medio?.saldoInicial ? String(medio.saldoInicial) : "",
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nombre.trim() !== "" && emoji.trim() !== "";

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar({
      nombre: nombre.trim(),
      emoji: emoji.trim(),
      tipo: tipo.trim(),
      saldoInicial: Number(saldoInicial) || 0,
    });
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo
      titulo={medio ? "Editar medio" : "Nuevo medio"}
      onCerrar={onCerrar}
    >
      <span className="lbl">Nombre</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="BBVA, NU, Efectivo…"
      />

      <span className="lbl">Emoji</span>
      <SelectorEmoji value={emoji} onChange={setEmoji} />

      <span className="lbl">Tipo</span>
      <input
        className="nbs finput outline-none"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        placeholder="débito, crédito, cash…"
      />

      <span className="lbl">Saldo inicial · desde dónde cuenta la app</span>
      <label className="nbs finput flex items-center gap-1">
        $
        <input
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={conComas(saldoInicial)}
          onChange={(e) => setSaldoInicial(limpiarMonto(e.target.value))}
          inputMode="decimal"
          placeholder="0"
        />
      </label>

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
