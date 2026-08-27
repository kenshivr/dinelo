"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ayerDe, fechaDe, nombreMes, useHoy } from "@/lib/fechas";
import { diasEnMes, sumarMes } from "@/lib/mes";
import { capitalizar, fmtMonto } from "@/lib/formato";
import { PageHeader } from "@/components/page-header";
import { GraficaPastel, type Rebanada } from "@/components/dash/grafica-pastel";
import { GraficaDias } from "@/components/dash/grafica-dias";
import {
  colorBloque,
  type Categoria,
  type ColorBloque,
  type Medio,
  type Movimiento,
} from "@/lib/tipos";

type Props = {
  mes: string; // yyyy-mm — el server ya trajo SOLO MIS movimientos de este mes (app individual)
  esDefault: boolean; // la URL venía sin ?mes=: el server usó su mes actual (UTC)
  movimientos: Movimiento[]; // orden: fecha desc, created_at desc
  categorias: Categoria[];
  medios: Medio[];
  previos: { ingresos: number; gastos: number }; // totales del mes anterior, para la comparativa
  apartadosPendientes: number; // suma de apartados sin pagar hasta el mes visible
};

const formatoCorto = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

// La barra más larga ocupa 88% del track, como en el mock
const ANCHO_BARRA_MAX = 88;

// Colores para conceptos de ingreso (no tienen categoría): los primeros son los
// pares más distinguibles para daltonismo según el validador de paleta
const PALETA_CONCEPTOS: ColorBloque[] = [
  "f-g",
  "f-b",
  "f-y",
  "f-p",
  "f-gg",
  "f-r",
];

export function DashView({
  mes,
  esDefault,
  movimientos,
  categorias,
  medios,
  previos,
  apartadosPendientes,
}: Props) {
  const hoy = useHoy();
  const router = useRouter();
  const [cambiando, startTransition] = useTransition();
  const [tipoVista, setTipoVista] = useState<"gasto" | "ingreso">("gasto");

  // El server no conoce la zona horaria del teléfono: si entró sin ?mes= y acá
  // todavía es el mes anterior (tarde del último día), se corrige solo.
  const mesCliente = hoy ? hoy.slice(0, 7) : null;
  useEffect(() => {
    if (esDefault && mesCliente && mesCliente !== mes) {
      router.replace(`/dash?mes=${mesCliente}`, { scroll: false });
    }
  }, [esDefault, mesCliente, mes, router]);

  function irAlMes(nuevo: string) {
    startTransition(() =>
      router.replace(`/dash?mes=${nuevo}`, { scroll: false }),
    );
  }

  const gastosMes = movimientos.filter((m) => m.tipo === "gasto");
  const totalIngresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((s, m) => s + m.monto, 0);
  const totalGastos = gastosMes.reduce((s, m) => s + m.monto, 0);

  // los gastos sin categoría forman su propio grupo (categoría opcional)
  const porCategoria = [
    ...categorias.map((c) => ({
      ...c,
      total: gastosMes
        .filter((m) => m.categoriaId === c.id)
        .reduce((s, m) => s + m.monto, 0),
    })),
    {
      id: "sin-categoria",
      nombre: "Sin categoría",
      color: "f-n" as ColorBloque,
      total: gastosMes
        .filter((m) => !m.categoriaId)
        .reduce((s, m) => s + m.monto, 0),
    },
  ]
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
  const mayor = porCategoria[0]?.total ?? 0;

  // últimos 8 del mes (decisión 2026-08-12); el detalle completo vive en Historial
  const recientes = movimientos.slice(0, 8);

  const movsDelTipo = movimientos.filter((m) => m.tipo === tipoVista);

  function rebanadas(): Rebanada[] {
    const movs = movsDelTipo;
    let grupos: Rebanada[];
    if (tipoVista === "gasto") {
      grupos = [
        ...categorias.map((c) => ({
          nombre: c.nombre,
          color: colorBloque[c.color],
          monto: movs
            .filter((m) => m.categoriaId === c.id)
            .reduce((s, m) => s + m.monto, 0),
        })),
        {
          nombre: "Sin categoría",
          color: colorBloque["f-n"],
          monto: movs
            .filter((m) => !m.categoriaId)
            .reduce((s, m) => s + m.monto, 0),
        },
      ];
    } else {
      // los ingresos no tienen categoría: se componen por concepto;
      // color estable por orden alfabético, no por ranking
      const conceptos = [...new Set(movs.map((m) => m.concepto))].sort((a, b) =>
        a.localeCompare(b),
      );
      grupos = conceptos.map((concepto, i) => ({
        nombre: concepto,
        color: colorBloque[PALETA_CONCEPTOS[i % PALETA_CONCEPTOS.length]],
        monto: movs
          .filter((m) => m.concepto === concepto)
          .reduce((s, m) => s + m.monto, 0),
      }));
    }
    return grupos.filter((g) => g.monto > 0).sort((a, b) => b.monto - a.monto);
  }

  function porDia(): number[] {
    const valores = Array.from({ length: diasEnMes(mes) }, () => 0);
    for (const m of movsDelTipo)
      valores[Number(m.fecha.slice(8, 10)) - 1] += m.monto;
    return valores;
  }

  const valoresDia = porDia();

  function fechaLabel(fecha: string) {
    if (hoy) {
      if (fecha === hoy) return "hoy";
      if (fecha === ayerDe(hoy)) return "ayer";
    }
    return formatoCorto.format(fechaDe(fecha)).replace(".", "");
  }

  function detalle(m: Movimiento) {
    const categoria = categorias.find((c) => c.id === m.categoriaId)?.nombre;
    const medio = medios.find((x) => x.id === m.medioId)?.nombre;
    return [m.tipo === "gasto" ? categoria : null, medio, fechaLabel(m.fecha)]
      .filter(Boolean)
      .join(" · ");
  }

  const nombre = nombreMes(mes);
  const labelMes = `${capitalizar(nombre)} ${mes.slice(0, 4)}`;
  const sinDatos =
    tipoVista === "gasto" ? "Sin gastos este mes" : "Sin ingresos este mes";
  const colorTipo =
    tipoVista === "gasto" ? colorBloque["f-p"] : colorBloque["f-g"];

  const selectorMes = (
    <span
      className={cn(
        "flex items-baseline gap-1.5 text-xs font-bold text-muted-foreground",
        cambiando && "opacity-50",
      )}
    >
      <button className="px-1" onClick={() => irAlMes(sumarMes(mes, -1))}>
        ‹
      </button>
      <span className="min-w-24 text-center">{labelMes}</span>
      <button
        className="px-1 disabled:opacity-40"
        disabled={!mesCliente || mes >= mesCliente}
        onClick={() => irAlMes(sumarMes(mes, 1))}
      >
        ›
      </button>
    </span>
  );

  return (
    <>
      <PageHeader title="Dashboard" derecha={selectorMes} />

      {/* mientras llega el mes pedido, lo visible pulsa como "cargando" */}
      <div className={cn("flex flex-col gap-3", cambiando && "animate-pulse")}>
        {/* colores fuera del semáforo del Restante (verde/amarillo/rojo) a propósito */}
        <div className="grid grid-cols-2 gap-2.5">
          <Stat
            titulo="Ingresos"
            monto={totalIngresos}
            color="f-c"
            pie={comparativa(totalIngresos, previos.ingresos, mes)}
          />
          <Stat
            titulo="Gastos"
            monto={totalGastos}
            color="f-m"
            pie={comparativa(totalGastos, previos.gastos, mes)}
          />
        </div>

        {movimientos.length === 0 ? (
          <div className="nbs flex flex-col items-center gap-2 px-4 py-9 text-center">
            <span className="text-[42px]">🌵</span>
            <b className="text-[15px] font-black">
              Sin movimientos en {nombre}
            </b>
            <span className="text-xs font-bold leading-relaxed text-muted-foreground">
              Cuando registres un gasto o un ingreso, aquí aparece la magia:
              gráficas, totales y todo el chisme financiero.
            </span>
          </div>
        ) : (
          <>
            <TileSemaforo
              titulo="Restante"
              monto={totalIngresos - totalGastos}
              ingresos={totalIngresos}
            />
            {apartadosPendientes > 0 && (
              <TileSemaforo
                titulo="Libre"
                monto={totalIngresos - totalGastos - apartadosPendientes}
                ingresos={totalIngresos}
                pie={`apartados pendientes ${fmtMonto(apartadosPendientes)}`}
              />
            )}

            <div className="seg">
              <button
                className={cn(tipoVista === "gasto" && "on")}
                onClick={() => setTipoVista("gasto")}
              >
                Gastos
              </button>
              <button
                className={cn(tipoVista === "ingreso" && "on")}
                onClick={() => setTipoVista("ingreso")}
              >
                Ingresos
              </button>
            </div>

            <div className="nbs flex flex-col gap-2 px-3.5 py-3">
              <span className="text-xs font-black">
                {tipoVista === "gasto" ? "Por categoría" : "Por concepto"}
              </span>
              <GraficaPastel rebanadas={rebanadas()} vacio={sinDatos} />
            </div>
            <div className="nbs flex flex-col gap-2 px-3.5 py-3">
              <span className="flex items-center gap-1.5 text-xs font-black">
                Por día
                <span className="ml-auto text-[10.5px] font-extrabold text-muted-foreground">
                  {fmtMonto(valoresDia.reduce((s, v) => s + v, 0))}
                </span>
              </span>
              <GraficaDias
                key={`${mes}-${tipoVista}`}
                valores={valoresDia}
                color={colorTipo}
                mes={mes}
                vacio={sinDatos}
              />
            </div>

            {porCategoria.length > 0 && (
              <div className="nbs flex flex-col gap-[9px] px-3.5 py-3">
                <span className="text-xs font-black">Gastos por categoría</span>
                {porCategoria.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 text-[11px] font-extrabold"
                  >
                    <span className="w-16 truncate text-muted-foreground">
                      {c.nombre}
                    </span>
                    <span className="flex flex-1 items-center">
                      <span
                        className={cn("bfill", c.color)}
                        style={{
                          width: `${(c.total / mayor) * ANCHO_BARRA_MAX}%`,
                        }}
                      />
                    </span>
                    <span className="min-w-11 text-right text-[10.5px] text-muted-foreground">
                      {fmtMonto(c.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="nbs flex flex-col gap-[9px] px-3.5 py-3">
              <span className="text-xs font-black">Movimientos recientes</span>
              {recientes.map((m) => {
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-2.5 border-t-[1.5px] border-dashed pt-[9px] first-of-type:border-t-0 first-of-type:pt-0"
                  >
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-[13px] font-extrabold">
                        {m.concepto}
                      </b>
                      <span className="text-[10.5px] font-bold text-muted-foreground">
                        {detalle(m)}
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
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// "↑ 12% vs jul" — sin datos del mes anterior no hay contra qué comparar (null)
function comparativa(actual: number, previo: number, mes: string) {
  if (previo <= 0) return null;
  const delta = Math.round(((actual - previo) / previo) * 100);
  const vs = nombreMes(sumarMes(mes, -1)).slice(0, 3);
  if (delta === 0) return `igual que ${vs}`;
  return `${delta > 0 ? "↑" : "↓"} ${Math.abs(delta)}% vs ${vs}`;
}

function Stat({
  titulo,
  monto,
  color,
  pie,
}: {
  titulo: string;
  monto: number;
  color: string;
  pie?: string | null;
}) {
  return (
    <div className={cn("stat", color)}>
      <div className="text-[9.5px] font-black uppercase tracking-[0.1em]">
        {titulo}
      </div>
      <div className="mt-0.5 text-[21px] font-black tracking-tight">
        {fmtMonto(monto)}
      </div>
      {pie && <div className="mt-0.5 text-[10px] font-extrabold">{pie}</div>}
    </div>
  );
}

// Semáforo del mes: ≥70% del ingreso verde fuerte (más que el f-g de Ingresos),
// 40–69% amarillo, <40% rojo. Sin ingresos cuenta como 0%. Lo usan Restante
// (ingresos − gastos reales) y Libre (además descuenta apartados pendientes).
function TileSemaforo({
  titulo,
  monto,
  ingresos,
  pie,
}: {
  titulo: string;
  monto: number;
  ingresos: number;
  pie?: string;
}) {
  const pct =
    ingresos > 0
      ? Math.max(0, Math.min(100, Math.round((monto / ingresos) * 100)))
      : 0;
  const color = pct >= 70 ? "f-gg" : pct >= 40 ? "f-y" : "f-r";

  return (
    <div className={cn("stat", color)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[9.5px] font-black uppercase tracking-[0.1em]">
          {titulo}
        </span>
        <span className="text-[10px] font-extrabold">
          {pct}% de tus ingresos
        </span>
      </div>
      <div className="mt-0.5 text-[21px] font-black tracking-tight">
        {fmtMonto(monto)}
      </div>
      <div className="mt-2 h-3.5 overflow-hidden rounded-full border-2 border-[#111]">
        <div className="h-full bg-[#111]" style={{ width: `${pct}%` }} />
      </div>
      {pie && <div className="mt-1.5 text-[10px] font-extrabold">{pie}</div>}
    </div>
  );
}
