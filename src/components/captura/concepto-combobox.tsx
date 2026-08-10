"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import type { Frecuente } from "@/lib/mock-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  frecuentes: Frecuente[];
  placeholder: string;
};

export function ConceptoCombobox({ value, onChange, frecuentes, placeholder }: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <div className="nbs flex items-center justify-between px-3.5">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setAbierto(true)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm font-extrabold outline-none placeholder:text-muted-foreground"
        />
        {chevron}
      </div>

      {abierto && (
        <div className="nbs p-[7px]">
          {frecuentes.map((f) => (
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
          ))}
          <button className="drow text-muted-foreground" onClick={() => setAbierto(false)}>
            ✏️ escribí uno nuevo…
          </button>
        </div>
      )}
    </>
  );
}
