"use client";

import { useState } from "react";
import { fechaDe, fechaLocal } from "@/lib/fechas";
import { fmtMonto } from "@/lib/formato";
import { basurita, flechas } from "@/components/icons";
import { useToast } from "@/components/toast";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { TransferirDialogo } from "@/components/control/transferir-dialogo";
import { borrarTransferencia, transferir } from "@/app/(tabs)/metas/acciones";
import type { Medio, Transferencia } from "@/lib/tipos";

type Props = {
  medios: Medio[];
  saldos: Record<string, number>; // por id de medio — los calcula el server
  transferencias: Transferencia[]; // solo las más recientes, orden created_at desc
};

const formatoDia = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" });

export function MediosSeccion({ medios, saldos, transferencias }: Props) {
  const toast = useToast();
  const [transfiriendo, setTransfiriendo] = useState<Medio | null>(null);
  const [borrando, setBorrando] = useState<Transferencia | null>(null);

  const total = medios.reduce((suma, m) => suma + (saldos[m.id] ?? 0), 0);

  function nombreMedio(id: string | null) {
    const m = medios.find((x) => x.id === id); // "—" = la punta de un medio ya borrado
    return m ? `${m.emoji} ${m.nombre}` : "—";
  }

  return (
    <>
      {medios.length === 0 ? (
        <div className="nbs flex flex-col items-center gap-1.5 px-5 py-10 text-center">
          <span className="text-3xl">💱</span>
          <b className="text-sm font-extrabold">Sin medios todavía</b>
          <span className="text-xs font-bold text-muted-foreground">
            Da de alta tus medios (banco, efectivo…) en Configuración y aquí verás cuánto hay en cada uno.
          </span>
        </div>
      ) : (
        <span className="lbl">en total · {fmtMonto(total)}</span>
      )}

      {medios.map((m) => (
        <div key={m.id} className="nbs flex items-center gap-2 p-3.5">
          <span className="text-[17px]">{m.emoji}</span>
          <b className="min-w-0 flex-1 truncate text-[15px] font-black">{m.nombre}</b>
          <b className="whitespace-nowrap text-[13.5px] font-black">{fmtMonto(saldos[m.id] ?? 0)}</b>
          <button className="mini" onClick={() => setTransfiriendo(m)}>
            {flechas}
          </button>
        </div>
      ))}

      {transferencias.length > 0 && (
        <>
          <span className="lbl">últimas transferencias</span>
          {transferencias.map((t) => (
            <div key={t.id} className="nbs crow">
              <span className="w-14 text-[11px] font-bold text-muted-foreground">
                {formatoDia.format(fechaDe(t.fecha)).replace(".", "")}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-extrabold">
                {nombreMedio(t.origenId)} → {nombreMedio(t.destinoId)}
              </span>
              <b className="text-xs font-extrabold">{fmtMonto(t.monto)}</b>
              <button className="mini" onClick={() => setBorrando(t)}>
                {basurita}
              </button>
            </div>
          ))}
        </>
      )}

      {transfiriendo && (
        <TransferirDialogo
          key={transfiriendo.id}
          origen={transfiriendo}
          saldoOrigen={saldos[transfiriendo.id] ?? 0}
          destinos={medios.filter((m) => m.id !== transfiriendo.id)}
          onTransferir={async (datos) => {
            const error = await transferir({
              origenId: transfiriendo.id,
              ...datos,
              fecha: fechaLocal(new Date()), // la fecha del teléfono, no la del server (UTC)
            });
            if (!error) {
              setTransfiriendo(null);
              toast("¡Transferido! 💱");
            }
            return error;
          }}
          onCerrar={() => setTransfiriendo(null)}
        />
      )}

      {borrando && (
        <ConfirmarBorrado
          titulo="¿Borrar esta transferencia?"
          resumen={`${nombreMedio(borrando.origenId)} → ${nombreMedio(borrando.destinoId)} · ${fmtMonto(borrando.monto)}`}
          onBorrar={async () => {
            const error = await borrarTransferencia(borrando.id);
            if (!error) setBorrando(null);
            return error;
          }}
          onCerrar={() => setBorrando(null)}
        />
      )}
    </>
  );
}
