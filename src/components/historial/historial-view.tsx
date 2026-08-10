"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ayerDe, fechaDe, nombreMes, useHoy } from "@/lib/fechas";
import { capitalizar, fmtMonto } from "@/lib/formato";
import { basurita, lapiz } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { EditarDialogo } from "@/components/historial/editar-dialogo";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import type { Categoria, Medio, Movimiento } from "@/lib/mock-data";

type Props = {
  movimientosIniciales: Movimiento[];
  categorias: Categoria[];
  medios: Medio[];
};

type FiltroTipo = "todo" | "gasto" | "ingreso";

const formatoDia = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function HistorialView({ movimientosIniciales, categorias, medios }: Props) {
  const hoy = useHoy();
  // fase 2: los cambios van a Supabase; por ahora viven en memoria local
  const [movs, setMovs] = useState(movimientosIniciales);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todo");
  const [filtroMes, setFiltroMes] = useState(() => {
    const ultima = movimientosIniciales.reduce((max, m) => (m.fecha > max ? m.fecha : max), "");
    return ultima.slice(0, 7);
  });
  const [mesAbierto, setMesAbierto] = useState(false);
  const [editando, setEditando] = useState<Movimiento | null>(null);
  const [borrando, setBorrando] = useState<Movimiento | null>(null);

  const meses = [...new Set(movs.map((m) => m.fecha.slice(0, 7)))].sort().reverse();

  const visibles = movs
    .filter((m) => filtroTipo === "todo" || m.tipo === filtroTipo)
    .filter((m) => !filtroMes || m.fecha.startsWith(filtroMes))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const dias = [...new Set(visibles.map((m) => m.fecha))];

  function etiquetaDia(fecha: string) {
    if (hoy) {
      if (fecha === hoy) return "Hoy";
      if (fecha === ayerDe(hoy)) return "Ayer";
    }
    return formatoDia.format(fechaDe(fecha)).replaceAll(",", "").replace(".", "");
  }

  function subtitulo(m: Movimiento) {
    const medio = medios.find((x) => x.id === m.medioId)?.nombre;
    if (m.tipo === "ingreso") return `Ingreso · ${medio}`;
    const categoria = categorias.find((c) => c.id === m.categoriaId)?.nombre;
    return `${categoria} · ${medio}`;
  }

  const etiquetaMes = filtroMes
    ? `${capitalizar(nombreMes(filtroMes))} ${filtroMes.slice(0, 4)}`
    : "Todos";

  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Historial</Link>}
        derecha={<span className="text-xs font-bold text-muted-foreground">desde Cuenta</span>}
      />

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["todo", "Todo"],
            ["gasto", "Gastos"],
            ["ingreso", "Ingresos"],
          ] as const
        ).map(([valor, label]) => (
          <button
            key={valor}
            className={cn("chip", filtroTipo === valor && "f-y")}
            onClick={() => setFiltroTipo(valor)}
          >
            {label}
          </button>
        ))}
        <button className="chip" onClick={() => setMesAbierto(!mesAbierto)}>
          {etiquetaMes} ▾
        </button>
      </div>

      {mesAbierto && (
        <div className="nbs p-[7px]">
          <button
            className={cn("drow", !filtroMes && "on")}
            onClick={() => {
              setFiltroMes("");
              setMesAbierto(false);
            }}
          >
            Todos los meses
          </button>
          {meses.map((m) => (
            <button
              key={m}
              className={cn("drow", filtroMes === m && "on")}
              onClick={() => {
                setFiltroMes(m);
                setMesAbierto(false);
              }}
            >
              {capitalizar(nombreMes(m))} {m.slice(0, 4)}
            </button>
          ))}
        </div>
      )}

      {dias.length === 0 ? (
        <div className="nbs mt-2 flex flex-col items-center gap-2 px-4 py-9 text-center">
          <span className="text-[42px]">🧾</span>
          <b className="text-[15px] font-black">Todavía no hay registros</b>
          <span className="text-xs font-bold leading-relaxed text-muted-foreground">
            Tus gastos e ingresos van a aparecer acá, agrupados por día, listos para editar o
            borrar si se te fue un dedazo.
          </span>
        </div>
      ) : (
        dias.map((dia) => (
          <Fragment key={dia}>
            <span className="lbl">{etiquetaDia(dia)}</span>
            {visibles
              .filter((m) => m.fecha === dia)
              .map((m) => (
                <div key={m.id} className="nbs crow">
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[13px] font-extrabold">{m.concepto}</b>
                    <span className="text-[10.5px] font-bold text-muted-foreground">
                      {subtitulo(m)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "whitespace-nowrap text-[13.5px] font-black",
                      m.tipo === "gasto" ? "text-negative" : "text-positive",
                    )}
                  >
                    {m.tipo === "gasto" ? "−" : "+"}
                    {fmtMonto(m.monto)}
                  </span>
                  <button className="mini" onClick={() => setEditando(m)}>
                    {lapiz}
                  </button>
                  <button className="mini" onClick={() => setBorrando(m)}>
                    {basurita}
                  </button>
                </div>
              ))}
          </Fragment>
        ))
      )}

      {editando && (
        <EditarDialogo
          key={editando.id}
          movimiento={editando}
          categorias={categorias}
          medios={medios}
          onGuardar={(editado) => {
            setMovs(movs.map((m) => (m.id === editado.id ? editado : m)));
            setEditando(null);
          }}
          onCerrar={() => setEditando(null)}
        />
      )}

      {borrando && (
        <ConfirmarBorrado
          titulo="¿Borrar este movimiento?"
          resumen={`${borrando.concepto} · ${borrando.tipo === "gasto" ? "−" : "+"}${fmtMonto(borrando.monto)} · ${etiquetaDia(borrando.fecha).toLowerCase()}`}
          onBorrar={() => {
            setMovs(movs.filter((m) => m.id !== borrando.id));
            setBorrando(null);
          }}
          onCerrar={() => setBorrando(null)}
        />
      )}
    </>
  );
}
