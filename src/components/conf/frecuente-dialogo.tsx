"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialogo } from "@/components/dialogo";
import { SelectorEmoji } from "@/components/selector-emoji";
import type { Frecuente } from "@/lib/tipos";

type Props = {
  frecuente: Frecuente | null; // null = nuevo
  onGuardar: (datos: {
    nombre: string;
    emoji: string;
    tipo: "G" | "I";
  }) => Promise<string | null>;
  onCerrar: () => void;
};

export function FrecuenteDialogo({ frecuente, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(frecuente?.nombre ?? "");
  const [emoji, setEmoji] = useState(frecuente?.emoji ?? "");
  const [tipo, setTipo] = useState<"G" | "I">(frecuente?.tipo ?? "G");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nombre.trim() !== "" && emoji.trim() !== "";

  async function guardar() {
    setGuardando(true);
    const e = await onGuardar({
      nombre: nombre.trim(),
      emoji: emoji.trim(),
      tipo,
    });
    if (e) {
      setError(e);
      setGuardando(false);
    }
  }

  return (
    <Dialogo
      titulo={frecuente ? "Editar frecuente" : "Nuevo frecuente"}
      onCerrar={onCerrar}
    >
      <span className="lbl">Concepto</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Renta, Quincena…"
        autoCapitalize="words"
      />

      <span className="lbl">Emoji</span>
      <SelectorEmoji value={emoji} onChange={setEmoji} />

      <span className="lbl">Tipo</span>
      <div className="flex gap-2">
        <button
          className={cn("chip", tipo === "G" && "f-y")}
          onClick={() => setTipo("G")}
        >
          G · Gasto
        </button>
        <button
          className={cn("chip", tipo === "I" && "f-y")}
          onClick={() => setTipo("I")}
        >
          I · Ingreso
        </button>
      </div>

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
