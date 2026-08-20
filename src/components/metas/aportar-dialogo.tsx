"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import { conComas, fmtMonto, limpiarMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import type { Medio, Meta } from "@/lib/tipos";

type Props = {
  meta: Meta;
  restante: number; // lo que falta para el objetivo — no se puede aportar más
  medios: Medio[];
  onAportar: (datos: { monto: number; medioId: string | null }) => Promise<string | null>;
  onCerrar: () => void;
};

// El medio es opcional, como en la captura de Gastos (sin elegir → "Sin medio").
export function AportarDialogo({ meta, restante, medios, onAportar, onCerrar }: Props) {
  const [monto, setMonto] = useState("");
  const [medioId, setMedioId] = useState<string | null>(null);
  const [medioAbierto, setMedioAbierto] = useState(false);
  const [aportando, setAportando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const medio = medios.find((m) => m.id === medioId);
  const excedido = Number(monto) > restante;
  const listo = Number(monto) > 0 && !excedido;

  async function aportar() {
    if (!listo || aportando) return;
    setAportando(true);
    setError(null);
    const e = await onAportar({ monto: Number(monto), medioId });
    if (e) {
      setError(e);
      setAportando(false);
    }
  }

  return (
    <Dialogo titulo={`Aportar a ${meta.nombre}`} onCerrar={onCerrar}>
      <span className="lbl">Monto</span>
      <label className="nbs finput flex items-center gap-1">
        $
        <input
          className="min-w-0 flex-1 bg-transparent outline-none"
          value={conComas(monto)}
          onChange={(e) => setMonto(limpiarMonto(e.target.value))}
          inputMode="decimal"
          placeholder="0"
        />
      </label>
      {excedido && (
        <div className="nbs f-y px-3.5 py-2.5 text-center text-xs font-extrabold">
          Solo faltan {fmtMonto(restante)} para completarla — ajusta el monto.
        </div>
      )}

      <span className="lbl">¿De dónde salió? · opcional</span>
      {medios.length > 0 ? (
        <>
          <button
            className="nbs flex items-center justify-between px-3.5 py-3 text-sm font-extrabold"
            onClick={() => setMedioAbierto(!medioAbierto)}
          >
            <span className={cn(!medio && "text-muted-foreground")}>
              {medio ? `${medio.emoji}  ${medio.nombre}` : "Sin medio"}
            </span>
            {chevron}
          </button>
          {medioAbierto && (
            <div className="nbs p-[7px]">
              {medios.map((m) => (
                <button
                  key={m.id}
                  className={cn("drow", medioId === m.id && "on")}
                  onClick={() => {
                    // tocar el elegido lo quita: vuelve a "Sin medio"
                    setMedioId(medioId === m.id ? null : m.id);
                    setMedioAbierto(false);
                  }}
                >
                  {m.emoji} {m.nombre}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <span className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Sin medios todavía — irá sin medio
        </span>
      )}

      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}

      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button
          className="btn sm f-gg flex-1 disabled:opacity-60"
          disabled={!listo || aportando}
          onClick={aportar}
        >
          {aportando ? "Aportando…" : "Aportar"}
        </button>
      </div>
    </Dialogo>
  );
}
