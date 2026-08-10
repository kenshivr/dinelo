"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialogo } from "@/components/dialogo";
import { SelectorEmoji } from "@/components/selector-emoji";
import type { Frecuente } from "@/lib/mock-data";

type Props = {
  frecuente: Frecuente | null; // null = nuevo
  onGuardar: (frecuente: Frecuente) => void;
  onCerrar: () => void;
};

export function FrecuenteDialogo({ frecuente, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(frecuente?.nombre ?? "");
  const [emoji, setEmoji] = useState(frecuente?.emoji ?? "");
  const [tipo, setTipo] = useState<"G" | "I">(frecuente?.tipo ?? "G");

  const listo = nombre.trim() !== "" && emoji.trim() !== "";

  function guardar() {
    onGuardar({
      id: frecuente?.id ?? crypto.randomUUID(),
      nombre: nombre.trim(),
      emoji: emoji.trim(),
      tipo,
    });
  }

  return (
    <Dialogo titulo={frecuente ? "Editar frecuente" : "Nuevo frecuente"} onCerrar={onCerrar}>
      <span className="lbl">Concepto</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Renta, Quincena…"
      />

      <span className="lbl">Emoji</span>
      <SelectorEmoji value={emoji} onChange={setEmoji} />

      <span className="lbl">Tipo</span>
      <div className="flex gap-2">
        <button className={cn("chip", tipo === "G" && "f-y")} onClick={() => setTipo("G")}>
          G · Gasto
        </button>
        <button className={cn("chip", tipo === "I" && "f-y")} onClick={() => setTipo("I")}>
          I · Ingreso
        </button>
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
