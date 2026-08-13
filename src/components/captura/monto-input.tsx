"use client";

import { conComas, limpiarMonto } from "@/lib/formato";

type Props = {
  value: string; // crudo: dígitos y punto — el form hace Number(value) directo
  onChange: (value: string) => void;
};

export function MontoInput({ value, onChange }: Props) {
  const mostrado = conComas(value);
  return (
    <label className="block pt-1 text-center">
      <span className="flex items-baseline justify-center text-5xl font-black tracking-tight">
        $&nbsp;
        <input
          value={mostrado}
          onChange={(e) => onChange(limpiarMonto(e.target.value))}
          inputMode="decimal"
          placeholder="0"
          style={{ width: `${Math.max(mostrado.length, 1)}ch` }}
          className="bg-transparent text-5xl font-black tracking-tight outline-none placeholder:text-muted-foreground"
        />
      </span>
      <span className="lbl mt-1 block tracking-[0.24em]">MXN</span>
    </label>
  );
}
