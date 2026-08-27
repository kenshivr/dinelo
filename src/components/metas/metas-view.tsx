"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fechaDe, fechaLocal } from "@/lib/fechas";
import { fmtMonto } from "@/lib/formato";
import { basurita, lapiz } from "@/components/icons";
import { useToast } from "@/components/toast";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { MetaDialogo } from "@/components/metas/meta-dialogo";
import { AportarDialogo } from "@/components/metas/aportar-dialogo";
import {
  aportar,
  borrarAporte,
  borrarMeta,
  guardarMeta,
} from "@/app/(tabs)/metas/acciones";
import type { Aporte, Medio, Meta } from "@/lib/tipos";

type Props = {
  metas: Meta[];
  aportes: Aporte[]; // solo míos (RLS), orden created_at desc
  medios: Medio[];
};

const formatoDia = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

export function MetasView({ metas, aportes, medios }: Props) {
  const toast = useToast();
  const [metaDialogo, setMetaDialogo] = useState<Meta | "nueva" | null>(null);
  const [aportando, setAportando] = useState<Meta | null>(null);
  const [borrandoMeta, setBorrandoMeta] = useState<Meta | null>(null);
  const [borrandoAporte, setBorrandoAporte] = useState<Aporte | null>(null);
  const [abierta, setAbierta] = useState<string | null>(null);

  function nombreMedio(id?: string) {
    const m = medios.find((x) => x.id === id); // sin medio → ""
    return m ? `${m.emoji} ${m.nombre}` : "";
  }

  function juntadoDe(metaId: string) {
    return aportes
      .filter((a) => a.metaId === metaId)
      .reduce((suma, a) => suma + a.monto, 0);
  }

  return (
    <>
      {metas.length === 0 && (
        <div className="nbs flex flex-col items-center gap-1.5 px-5 py-10 text-center">
          <span className="text-3xl">🎯</span>
          <b className="text-sm font-extrabold">Todavía no hay metas</b>
          <span className="text-xs font-bold text-muted-foreground">
            Una meta es un objetivo con monto — crea la primera aquí abajo.
          </span>
        </div>
      )}

      {metas.map((meta) => {
        const deLaMeta = aportes.filter((a) => a.metaId === meta.id);
        const juntado = deLaMeta.reduce((suma, a) => suma + a.monto, 0);
        const pct = Math.min(100, Math.round((juntado / meta.objetivo) * 100));
        const cumplida = juntado >= meta.objetivo;

        return (
          <div key={meta.id} className="nbs flex flex-col gap-2.5 p-3.5">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1">
                <b className="block truncate text-[15px] font-black">
                  {meta.nombre}
                </b>
                {meta.descripcion && (
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {meta.descripcion}
                  </span>
                )}
              </span>
              <button className="mini" onClick={() => setMetaDialogo(meta)}>
                {lapiz}
              </button>
              <button className="mini" onClick={() => setBorrandoMeta(meta)}>
                {basurita}
              </button>
            </div>

            <div className="h-4 overflow-hidden rounded-full border-2">
              <div
                className={cn("h-full", cumplida ? "f-gg" : "f-y")}
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold">
                {fmtMonto(juntado)}{" "}
                <span className="font-bold text-muted-foreground">
                  de {fmtMonto(meta.objetivo)} · {pct}%
                </span>
              </span>
              {cumplida ? (
                <span className="chip f-gg">¡Cumplida! 🎉</span>
              ) : (
                <button
                  className="btn sm f-gg whitespace-nowrap px-4"
                  onClick={() => setAportando(meta)}
                >
                  ＋ Aportar
                </button>
              )}
            </div>

            {deLaMeta.length > 0 && (
              <button
                className="self-start text-[11px] font-bold text-muted-foreground"
                onClick={() => setAbierta(abierta === meta.id ? null : meta.id)}
              >
                {deLaMeta.length} {deLaMeta.length === 1 ? "aporte" : "aportes"}{" "}
                {abierta === meta.id ? "▴" : "▾"}
              </button>
            )}
            {abierta === meta.id &&
              deLaMeta.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <span className="w-14 text-[11px] font-bold text-muted-foreground">
                    {formatoDia.format(fechaDe(a.fecha)).replace(".", "")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-extrabold">
                    {nombreMedio(a.medioId)}
                  </span>
                  <b className="text-xs font-extrabold">{fmtMonto(a.monto)}</b>
                  <button className="mini" onClick={() => setBorrandoAporte(a)}>
                    {basurita}
                  </button>
                </div>
              ))}
          </div>
        );
      })}

      <button
        className="dock f-gg -mx-[18px] mt-auto"
        onClick={() => setMetaDialogo("nueva")}
      >
        ＋ Nueva meta
      </button>

      {metaDialogo && (
        <MetaDialogo
          key={metaDialogo === "nueva" ? "nueva" : metaDialogo.id}
          meta={metaDialogo === "nueva" ? null : metaDialogo}
          onGuardar={async (datos) => {
            const error = await guardarMeta(
              metaDialogo === "nueva"
                ? datos
                : { ...datos, id: metaDialogo.id },
            );
            if (!error) setMetaDialogo(null);
            return error;
          }}
          onCerrar={() => setMetaDialogo(null)}
        />
      )}

      {aportando && (
        <AportarDialogo
          key={aportando.id}
          meta={aportando}
          restante={aportando.objetivo - juntadoDe(aportando.id)}
          medios={medios}
          onAportar={async (datos) => {
            const error = await aportar({
              metaId: aportando.id,
              ...datos,
              fecha: fechaLocal(new Date()), // la fecha del teléfono, no la del server (UTC)
            });
            if (!error) {
              setAportando(null);
              toast("¡Aporte registrado! 🎯");
            }
            return error;
          }}
          onCerrar={() => setAportando(null)}
        />
      )}

      {borrandoMeta && (
        <ConfirmarBorrado
          titulo="¿Borrar esta meta?"
          resumen={`${borrandoMeta.nombre} — se borran también sus aportes`}
          onBorrar={async () => {
            const error = await borrarMeta(borrandoMeta.id);
            if (!error) setBorrandoMeta(null);
            return error;
          }}
          onCerrar={() => setBorrandoMeta(null)}
        />
      )}

      {borrandoAporte && (
        <ConfirmarBorrado
          titulo="¿Borrar este aporte?"
          resumen={[
            fmtMonto(borrandoAporte.monto),
            nombreMedio(borrandoAporte.medioId),
          ]
            .filter(Boolean)
            .join(" · ")}
          onBorrar={async () => {
            const error = await borrarAporte(borrandoAporte.id);
            if (!error) setBorrandoAporte(null);
            return error;
          }}
          onCerrar={() => setBorrandoAporte(null)}
        />
      )}
    </>
  );
}
