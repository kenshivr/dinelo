"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";
import { SelectorEmoji } from "@/components/selector-emoji";
import type { Medio } from "@/lib/mock-data";

type Props = {
  medio: Medio | null; // null = nuevo
  onGuardar: (medio: Medio) => void;
  onCerrar: () => void;
};

export function MedioDialogo({ medio, onGuardar, onCerrar }: Props) {
  const [nombre, setNombre] = useState(medio?.nombre ?? "");
  const [emoji, setEmoji] = useState(medio?.emoji ?? "");
  const [tipo, setTipo] = useState(medio?.tipo ?? "");

  const listo = nombre.trim() !== "" && emoji.trim() !== "";

  function guardar() {
    onGuardar({
      id: medio?.id ?? crypto.randomUUID(),
      nombre: nombre.trim(),
      emoji: emoji.trim(),
      tipo: tipo.trim(),
    });
  }

  return (
    <Dialogo titulo={medio ? "Editar medio" : "Nuevo medio"} onCerrar={onCerrar}>
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
