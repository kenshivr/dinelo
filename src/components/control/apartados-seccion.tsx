"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fmtMonto } from "@/lib/formato";
import { fechaLocal } from "@/lib/fechas";
import { basurita, lapiz } from "@/components/icons";
import { useToast } from "@/components/toast";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { ApartadoDialogo } from "@/components/control/apartado-dialogo";
import { PagarDialogo } from "@/components/control/pagar-dialogo";
import {
  borrarApartado,
  guardarApartado,
  pagarApartado,
} from "@/app/(tabs)/metas/acciones";
import type { Apartado, Categoria, Medio } from "@/lib/tipos";

type Props = {
  apartados: Apartado[]; // solo pendientes (el server filtra movimiento_id null)
  categorias: Categoria[];
  medios: Medio[];
};

export function ApartadosSeccion({ apartados, categorias, medios }: Props) {
  const toast = useToast();
  const [dialogo, setDialogo] = useState<Apartado | "nuevo" | null>(null);
  const [pagando, setPagando] = useState<Apartado | null>(null);
  const [borrando, setBorrando] = useState<Apartado | null>(null);

  const total = apartados.reduce((suma, a) => suma + a.monto, 0);

  return (
    <>
      {apartados.length === 0 ? (
        <div className="nbs flex flex-col items-center gap-1.5 px-5 py-10 text-center">
          <span className="text-3xl">📌</span>
          <b className="text-sm font-extrabold">Nada apartado todavía</b>
          <span className="text-xs font-bold text-muted-foreground">
            Cuando te paguen, reparte aquí lo ya comprometido (renta, luz…) y el
            Dash te dirá cuánto te queda LIBRE de verdad.
          </span>
        </div>
      ) : (
        <span className="lbl">pendientes · {fmtMonto(total)}</span>
      )}

      {apartados.map((a) => {
        const cat = categorias.find((c) => c.id === a.categoriaId);
        return (
          <div key={a.id} className="nbs flex flex-col gap-2.5 p-3.5">
            <div className="flex items-center gap-2">
              {cat && <span className={cn("tag", cat.color)} />}
              <b className="min-w-0 flex-1 truncate text-[15px] font-black">
                {a.nombre}
              </b>
              <b className="whitespace-nowrap text-[13.5px] font-black">
                {fmtMonto(a.monto)}
              </b>
              <button className="mini" onClick={() => setDialogo(a)}>
                {lapiz}
              </button>
              <button className="mini" onClick={() => setBorrando(a)}>
                {basurita}
              </button>
            </div>
            <button className="btn sm f-gg" onClick={() => setPagando(a)}>
              ✓ Ya lo pagué
            </button>
          </div>
        );
      })}

      <button
        className="dock f-gg -mx-[18px] mt-auto"
        onClick={() => setDialogo("nuevo")}
      >
        ＋ Nuevo apartado
      </button>

      {dialogo && (
        <ApartadoDialogo
          key={dialogo === "nuevo" ? "nuevo" : dialogo.id}
          apartado={dialogo === "nuevo" ? null : dialogo}
          categorias={categorias}
          onGuardar={async (datos) => {
            const error = await guardarApartado(
              dialogo === "nuevo"
                ? { ...datos, mes: fechaLocal(new Date()).slice(0, 7) } // el mes del teléfono
                : { ...datos, id: dialogo.id, mes: dialogo.mes },
            );
            if (!error) setDialogo(null);
            return error;
          }}
          onCerrar={() => setDialogo(null)}
        />
      )}

      {pagando && (
        <PagarDialogo
          key={pagando.id}
          apartado={pagando}
          categorias={categorias}
          medios={medios}
          onPagar={async (datos) => {
            const error = await pagarApartado({
              id: pagando.id,
              ...datos,
              fecha: fechaLocal(new Date()), // la fecha REAL del pago, la del teléfono
            });
            if (!error) {
              setPagando(null);
              toast("¡Pagado y registrado! 📌");
            }
            return error;
          }}
          onCerrar={() => setPagando(null)}
        />
      )}

      {borrando && (
        <ConfirmarBorrado
          titulo="¿Borrar este apartado?"
          resumen={`${borrando.nombre} · ${fmtMonto(borrando.monto)}`}
          onBorrar={async () => {
            const error = await borrarApartado(borrando.id);
            if (!error) setBorrando(null);
            return error;
          }}
          onCerrar={() => setBorrando(null)}
        />
      )}
    </>
  );
}
