"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";

// Grilla curada para una app de gastos: dinero · casa/transporte · comida/salidas · vida.
// El picker del SISTEMA no se puede abrir desde la web (no hay API), así que el menú es propio.
const EMOJIS = [
  "💵", "💰", "🏦", "💳", "🪙", "📈", "💼", "🧾",
  "🏠", "🔌", "🚗", "⛽", "🚌", "✈️", "📱", "🔧",
  "🛒", "🍽️", "🌮", "🍕", "☕", "🍺", "🎬", "🎮",
  "🛍️", "💊", "🏋️", "📚", "🎁", "🐶", "👶", "❤️",
];

type Props = {
  value: string;
  onChange: (emoji: string) => void;
};

export function SelectorEmoji({ value, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        className="nbs finput flex items-center justify-between"
        onClick={() => setAbierto(!abierto)}
      >
        {value ? (
          <span className="text-[17px]">{value}</span>
        ) : (
          <span className="text-sm text-muted-foreground">Elige un emoji</span>
        )}
        {chevron}
      </button>

      {abierto && (
        <div className="nbs flex flex-wrap gap-1.5 p-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              className={cn("sw2 text-[17px]", value === e && "f-y")}
              onClick={() => {
                onChange(e);
                setAbierto(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
