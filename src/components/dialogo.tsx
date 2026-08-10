"use client";

import type { ReactNode } from "react";

type Props = {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
};

// Molde de todos los diálogos de la app. Tocar fuera de la tarjeta = cerrar.
export function Dialogo({ titulo, onCerrar, children }: Props) {
  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="text-base font-black">{titulo}</div>
        {children}
      </div>
    </div>
  );
}
