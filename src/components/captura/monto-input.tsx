"use client";

import { cn } from "@/lib/utils";
import { conComas, limpiarMonto } from "@/lib/formato";

type Props = {
  value: string; // crudo: dígitos y punto — el form hace Number(value) directo
  onChange: (value: string) => void;
  error?: boolean;
  ref?: React.Ref<HTMLInputElement>;
};

export function MontoInput({ value, onChange, error, ref }: Props) {
  const mostrado = conComas(value);
  return (
    // ring (no border): el aro de error no mueve el layout
    <label
      className={cn(
        "block pt-1 text-center",
        error && "rounded-xl ring-2 ring-negative",
      )}
    >
      <span className="flex items-baseline justify-center text-5xl font-black tracking-tight">
        $&nbsp;
        <input
          ref={ref}
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
