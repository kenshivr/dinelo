"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { conComas, fmtMonto, limpiarMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import type { Medio } from "@/lib/tipos";

type Props = {
  origen: Medio;
  saldoOrigen: number;
  destinos: Medio[]; // los demás medios (sin el origen)
  onTransferir: (datos: {
    destinoId: string;
    monto: number;
  }) => Promise<string | null>;
  onCerrar: () => void;
};

// Mueve dinero entre medios sin tocar gastos ni ingresos (el Dash no lo ve).
export function TransferirDialogo({
  origen,
  saldoOrigen,
  destinos,
  onTransferir,
  onCerrar,
}: Props) {
  const [monto, setMonto] = useState("");
  const [destinoId, setDestinoId] = useState<string | null>(null);
  const [transfiriendo, setTransfiriendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const excedido = Number(monto) > saldoOrigen;
  const listo = Number(monto) > 0 && destinoId !== null;

  async function mover() {
    if (!listo || transfiriendo || !destinoId) return;
    setTransfiriendo(true);
    setError(null);
    const e = await onTransferir({ destinoId, monto: Number(monto) });
    if (e) {
      setError(e);
      setTransfiriendo(false);
    }
  }

  return (
    <Dialogo
      titulo={`Transferir de ${origen.emoji} ${origen.nombre}`}
      onCerrar={onCerrar}
    >
      <div className="nbs px-3.5 py-3 text-center">
        <b className="block text-[21px] font-black tracking-tight">
          {fmtMonto(saldoOrigen)}
        </b>
        <span className="text-[10.5px] font-bold text-muted-foreground">
          hay ahora en {origen.nombre}
        </span>
      </div>

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
          Es más de lo registrado en {origen.nombre} — puedes seguir si el saldo
          real es otro.
        </div>
      )}

      <span className="lbl">¿A qué medio entra?</span>
      {destinos.length > 0 ? (
        <div className="nbs p-[7px]">
          {destinos.map((m) => (
            <button
              key={m.id}
              className={cn("drow", destinoId === m.id && "on")}
              onClick={() => setDestinoId(destinoId === m.id ? null : m.id)}
            >
              {m.emoji} {m.nombre}
            </button>
          ))}
        </div>
      ) : (
        <span className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Necesitas otro medio para poder transferir — créalo en Configuración.
        </span>
      )}

      {error && (
        <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
          {error}
        </div>
      )}

      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button
          className="btn sm f-gg flex-1 disabled:opacity-60"
          disabled={!listo || transfiriendo}
          onClick={mover}
        >
          {transfiriendo ? "Transfiriendo…" : "Transferir"}
        </button>
      </div>
    </Dialogo>
  );
}
