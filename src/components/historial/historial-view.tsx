"use client";

import { Fragment, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ayerDe, fechaDe, nombreMes, useHoy } from "@/lib/fechas";
import { sumarMes } from "@/lib/mes";
import { capitalizar, fmtMonto } from "@/lib/formato";
import { basurita, lapiz } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { EditarDialogo } from "@/components/historial/editar-dialogo";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { borrarMovimiento, guardarMovimiento } from "@/app/(tabs)/cuenta/historial/acciones";
import type { Categoria, Medio, Movimiento } from "@/lib/tipos";

type Props = {
  mes: string; // yyyy-mm — el server ya trajo SOLO mis movimientos de este mes
  esDefault: boolean; // la URL venía sin ?mes=: el server usó su mes actual (UTC)
  desdeMes: string; // mes del movimiento más viejo: piso del dropdown
  movimientos: Movimiento[]; // orden: fecha desc, created_at desc
  categorias: Categoria[];
  medios: Medio[];
};

type FiltroTipo = "todo" | "gasto" | "ingreso";

const formatoDia = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function HistorialView({ mes, esDefault, desdeMes, movimientos, categorias, medios }: Props) {
  const hoy = useHoy();
  const router = useRouter();
  const [cambiando, startTransition] = useTransition();
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todo");
  const [mesAbierto, setMesAbierto] = useState(false);
  const [editando, setEditando] = useState<Movimiento | null>(null);
  const [borrando, setBorrando] = useState<Movimiento | null>(null);

  // Mismo arreglo del borde UTC que el Dash: el server no conoce la zona horaria.
  const mesCliente = hoy ? hoy.slice(0, 7) : null;
  useEffect(() => {
    if (esDefault && mesCliente && mesCliente !== mes) {
      router.replace(`/cuenta/historial?mes=${mesCliente}`, { scroll: false });
    }
  }, [esDefault, mesCliente, mes, router]);

  function irAlMes(nuevo: string) {
    setMesAbierto(false);
    startTransition(() => router.replace(`/cuenta/historial?mes=${nuevo}`, { scroll: false }));
  }

  // Del mes actual (o el visible, si es mayor) hacia atrás hasta el alta de la cuenta
  const tope = mesCliente && mesCliente > mes ? mesCliente : mes;
  const meses: string[] = [];
  for (let m = tope; m >= desdeMes && meses.length < 60; m = sumarMes(m, -1)) meses.push(m);
  if (meses.length === 0) meses.push(mes);

  const visibles = movimientos.filter((m) => filtroTipo === "todo" || m.tipo === filtroTipo);
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

  const etiquetaMes = `${capitalizar(nombreMes(mes))} ${mes.slice(0, 4)}`;

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
        <button
          className={cn("chip", cambiando && "opacity-50")}
          onClick={() => setMesAbierto(!mesAbierto)}
        >
          {etiquetaMes} ▾
        </button>
      </div>

      {mesAbierto && (
        <div className="nbs p-[7px]">
          {meses.map((m) => (
            <button key={m} className={cn("drow", mes === m && "on")} onClick={() => irAlMes(m)}>
              {capitalizar(nombreMes(m))} {m.slice(0, 4)}
            </button>
          ))}
        </div>
      )}

      {/* mientras llega el mes pedido, lo visible pulsa como "cargando" */}
      <div className={cn("flex flex-col gap-3", cambiando && "animate-pulse")}>
      {dias.length === 0 ? (
        <div className="nbs mt-2 flex flex-col items-center gap-2 px-4 py-9 text-center">
          <span className="text-[42px]">🧾</span>
          <b className="text-[15px] font-black">Todavía no hay registros</b>
          <span className="text-xs font-bold leading-relaxed text-muted-foreground">
            Tus gastos e ingresos van a aparecer aquí, agrupados por día, listos para editar o
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
      </div>

      {editando && (
        <EditarDialogo
          key={editando.id}
          movimiento={editando}
          categorias={categorias}
          medios={medios}
          onGuardar={async (editado) => {
            const e = await guardarMovimiento({
              id: editado.id,
              concepto: editado.concepto,
              monto: editado.monto,
              categoriaId: editado.categoriaId,
              medioId: editado.medioId,
              fecha: editado.fecha,
            });
            if (e) return e;
            setEditando(null);
            return null;
          }}
          onCerrar={() => setEditando(null)}
        />
      )}

      {borrando && (
        <ConfirmarBorrado
          titulo="¿Borrar este movimiento?"
          resumen={`${borrando.concepto} · ${borrando.tipo === "gasto" ? "−" : "+"}${fmtMonto(borrando.monto)} · ${etiquetaDia(borrando.fecha).toLowerCase()}`}
          onBorrar={async () => {
            const e = await borrarMovimiento(borrando.id);
            if (e) return e;
            setBorrando(null);
          }}
          onCerrar={() => setBorrando(null)}
        />
      )}
    </>
  );
}
