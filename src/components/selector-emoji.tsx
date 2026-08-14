"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";

// Grilla curada para una app de gastos, en filas temáticas de 8:
// dinero ×2 · casa/transporte · casa/servicios · comida/salidas ×2 · vida ×2.
// El picker del SISTEMA no se puede abrir desde la web (no hay API), así que el menú es propio.
const EMOJIS = [
  "💵", "💰", "🏦", "💳", "🪙", "📈", "💼", "🧾",
  "💸", "🏧", "🏛️", "📲", "🤑", "💎", "🧧", "🎰",
  "🏠", "🔌", "🚗", "⛽", "🚌", "✈️", "📱", "🔧",
  "💡", "🚿", "🛋️", "🧺", "🖥️", "📺", "🌐", "🧹",
  "🛒", "🍽️", "🌮", "🍕", "☕", "🍺", "🎬", "🎮",
  "🍔", "🍦", "🍿", "🍰", "🧋", "🥤", "⚽", "🎳",
  "🛍️", "💊", "🏋️", "📚", "🎁", "🐶", "👶", "❤️",
  "💇", "💅", "👗", "👟", "🏥", "🦷", "🐱", "🌸",
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

      {/* alto fijo = las 4 filas originales (4×36 + 3 gaps de 6 + padding 2×8);
          el resto de la grilla se alcanza scrolleando adentro */}
      {abierto && (
        <div className="nbs flex max-h-[178px] flex-wrap gap-1.5 overflow-y-auto overscroll-contain p-2">
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
