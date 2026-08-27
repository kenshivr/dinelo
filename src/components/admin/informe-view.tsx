import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EliminarCuentaAdmin } from "@/components/admin/eliminar-cuenta-admin";
import type { ColorBloque } from "@/lib/tipos";

// Vista del informe de admin — server salvo el 🗑 por cuenta (cliente).
// Muestra USO de la app (conteos y actividad), nunca montos de otras cuentas.

export type CuentaInforme = {
  id: string;
  nombre: string;
  inicial: string;
  color: ColorBloque;
  avatarUrl: string | null;
  email: string;
  desde: string; // yyyy-mm-dd
  movs: number;
  ultimoMov: string | null; // yyyy-mm-dd
  metas: number;
  apartados: number;
  medios: number;
  esAdmin: boolean;
};

export type Informe = {
  cuentas: CuentaInforme[];
  totales: {
    cuentas: number;
    altasMes: number;
    activas7: number;
    movs: number;
    movsMes: number;
    metas: number;
    apartados: number;
  };
  adopcion: { etiqueta: string; n: number }[];
  altasPorMes: { mes: string; n: number }[]; // yyyy-mm, viejo → nuevo
};

const fmtMes = new Intl.DateTimeFormat("es-MX", {
  month: "short",
  year: "numeric",
});
const fmtDia = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
});

// "ago. de 2026" → "ago 2026" (misma limpieza que "miembro desde" en Cuenta)
function etiquetaMes(mes: string) {
  return fmtMes
    .format(new Date(`${mes}-15T00:00:00`))
    .replaceAll(".", "")
    .replace(" de ", " ");
}

function etiquetaDia(fecha: string) {
  return fmtDia.format(new Date(`${fecha}T00:00:00`)).replaceAll(".", "");
}

export function InformeView({ informe }: { informe: Informe }) {
  const { cuentas, totales, adopcion, altasPorMes } = informe;
  const maxAltas = Math.max(1, ...altasPorMes.map((a) => a.n));

  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Informe</Link>}
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            solo admin
          </span>
        }
      />

      <span className="lbl">La app hoy</span>
      <div className="grid grid-cols-2 gap-3">
        <Tile
          titulo="Cuentas"
          valor={totales.cuentas}
          color="f-y"
          pie={
            totales.altasMes > 0
              ? `+${totales.altasMes} este mes`
              : "sin altas este mes"
          }
        />
        <Tile
          titulo="Activas 7 días"
          valor={totales.activas7}
          color="f-t"
          pie="con registros nuevos"
        />
        <Tile
          titulo="Movimientos"
          valor={totales.movs}
          color="f-b"
          pie={
            totales.movsMes > 0
              ? `+${totales.movsMes} este mes`
              : "ninguno este mes"
          }
        />
        <Tile
          titulo="Metas"
          valor={totales.metas}
          color="f-p"
          pie={`${totales.apartados} apartados`}
        />
      </div>

      <span className="lbl">Uso de la app</span>
      <div className="nbs flex flex-col gap-2.5 px-3.5 py-3">
        {adopcion.map((a) => (
          <div key={a.etiqueta}>
            <div className="flex items-baseline justify-between text-[11.5px] font-extrabold">
              <span>{a.etiqueta}</span>
              <span className="text-muted-foreground">
                {a.n} de {totales.cuentas}
              </span>
            </div>
            <div className="bfill mt-1 overflow-hidden">
              <div
                className="f-y h-full"
                style={{
                  width: `${totales.cuentas > 0 ? Math.round((a.n / totales.cuentas) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <span className="lbl">Altas por mes</span>
      <div className="nbs flex flex-col gap-2 px-3.5 py-3">
        {altasPorMes.map((a) => (
          <div key={a.mes} className="flex items-center gap-2.5">
            <span className="w-18 shrink-0 text-[11px] font-extrabold">
              {etiquetaMes(a.mes)}
            </span>
            <div className="bfill flex-1 overflow-hidden">
              <div
                className="f-b h-full"
                style={{ width: `${Math.round((a.n / maxAltas) * 100)}%` }}
              />
            </div>
            <span className="w-5 shrink-0 text-right text-[11.5px] font-black">
              {a.n}
            </span>
          </div>
        ))}
      </div>

      <span className="lbl">Cuentas ({totales.cuentas})</span>
      {cuentas.map((c) => (
        <div key={c.id} className="nbs px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            {c.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- 32px; next/image pide config de dominio remoto
              <img src={c.avatarUrl} alt="" className="av object-cover" />
            ) : (
              <span className={cn("av", c.color)}>{c.inicial}</span>
            )}
            <span className="min-w-0 flex-1">
              <b className="flex items-center gap-1.5 text-[13.5px] font-black">
                <span className="truncate">{c.nombre}</span>
                {c.esAdmin && (
                  <span className="f-y shrink-0 rounded-md border-2 border-[#111] px-1.5 text-[8.5px] font-black">
                    ADMIN
                  </span>
                )}
              </b>
              <span className="block truncate text-[10.5px] font-bold text-muted-foreground">
                {c.email}
              </span>
            </span>
            {!c.esAdmin && (
              <EliminarCuentaAdmin
                id={c.id}
                nombre={c.nombre}
                email={c.email}
              />
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10.5px] font-bold text-muted-foreground">
            <span>📒 {c.movs} movs</span>
            <span>🎯 {c.metas} metas</span>
            <span>📦 {c.apartados} apartados</span>
            <span>💳 {c.medios} medios</span>
          </div>
          <div className="mt-1 text-[10.5px] font-bold text-muted-foreground">
            desde {etiquetaMes(c.desde.slice(0, 7))} ·{" "}
            {c.ultimoMov
              ? `último registro ${etiquetaDia(c.ultimoMov)}`
              : "sin registros"}
          </div>
        </div>
      ))}
    </>
  );
}

// Molde de Stat del Dash, pero para conteos (sin fmtMonto)
function Tile({
  titulo,
  valor,
  color,
  pie,
}: {
  titulo: string;
  valor: number;
  color: string;
  pie?: string;
}) {
  return (
    <div className={cn("stat", color)}>
      <div className="text-[9.5px] font-black uppercase tracking-[0.1em]">
        {titulo}
      </div>
      <div className="mt-0.5 text-[21px] font-black tracking-tight">
        {valor}
      </div>
      {pie && <div className="mt-0.5 text-[10px] font-extrabold">{pie}</div>}
    </div>
  );
}
