"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import type { Frecuente } from "@/lib/tipos";

type Props = {
  value: string;
  onChange: (value: string) => void;
  frecuentes: Frecuente[];
  placeholder: string;
  tipo: "G" | "I";
  error?: boolean;
  ref?: React.Ref<HTMLInputElement>;
};

export function ConceptoCombobox({ value, onChange, frecuentes, placeholder, tipo, error, ref }: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <div className={cn("nbs flex items-center px-3.5", error && "border-negative")}>
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm font-extrabold outline-none placeholder:text-muted-foreground"
        />
        {/* la lista solo se abre a propósito: escribir no la dispara */}
        <button
          type="button"
          aria-label="Mis frecuentes"
          className={cn("-mr-2 p-2 transition-transform", abierto && "rotate-180")}
          onClick={() => setAbierto(!abierto)}
        >
          {chevron}
        </button>
      </div>

      {abierto && (
        <div className="nbs p-[7px]">
          {frecuentes.length > 0 ? (
            frecuentes.map((f) => (
              <button
                key={f.id}
                className={cn("drow", value === f.nombre && "on")}
                onClick={() => {
                  onChange(f.nombre);
                  setAbierto(false);
                }}
              >
                {f.emoji} {f.nombre}
              </button>
            ))
          ) : (
            <Link href="/cuenta/configuracion" className="drow text-muted-foreground">
              ＋ Da de alta un {tipo === "G" ? "gasto" : "ingreso"} frecuente →
            </Link>
          )}
        </div>
      )}
    </>
  );
}
