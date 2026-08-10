import { fmtMonto } from "@/lib/formato";

export type Rebanada = { nombre: string; monto: number; color: string };

type Props = {
  rebanadas: Rebanada[];
  vacio?: string;
};

const CX = 60;
const CY = 60;
const R = 52;

// ángulo 0 = las 12 en punto, crece en sentido horario
function punto(angulo: number) {
  return `${(CX + R * Math.sin(angulo)).toFixed(2)} ${(CY - R * Math.cos(angulo)).toFixed(2)}`;
}

export function GraficaPastel({ rebanadas, vacio = "Sin movimientos" }: Props) {
  const total = rebanadas.reduce((s, r) => s + r.monto, 0);

  if (total === 0) {
    return <p className="py-6 text-center text-[11px] font-bold text-muted-foreground">{vacio}</p>;
  }

  const porciones = rebanadas.reduce<(Rebanada & { desde: number; hasta: number; pct: number })[]>(
    (acc, r) => {
      const desde = acc.length ? acc[acc.length - 1].hasta : 0;
      const hasta = desde + (r.monto / total) * 2 * Math.PI;
      return [...acc, { ...r, desde, hasta, pct: Math.round((r.monto / total) * 100) }];
    },
    [],
  );

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 120 120" className="w-[104px] shrink-0" role="img">
        {porciones.length === 1 ? (
          <circle cx={CX} cy={CY} r={R} fill={porciones[0].color} stroke="#111" strokeWidth="2">
            <title>{`${porciones[0].nombre} · ${fmtMonto(porciones[0].monto)} · 100%`}</title>
          </circle>
        ) : (
          porciones.map((p) => (
            <path
              key={p.nombre}
              d={`M ${CX} ${CY} L ${punto(p.desde)} A ${R} ${R} 0 ${p.hasta - p.desde > Math.PI ? 1 : 0} 1 ${punto(p.hasta)} Z`}
              fill={p.color}
              stroke="#111"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <title>{`${p.nombre} · ${fmtMonto(p.monto)} · ${p.pct}%`}</title>
            </path>
          ))
        )}
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {porciones.map((p) => (
          <div key={p.nombre} className="flex items-center gap-1.5 text-[10.5px] font-bold">
            <span
              className="size-3 shrink-0 rounded-[4px] border-2 border-[#111]"
              style={{ background: p.color }}
            />
            <span className="min-w-0 flex-1 truncate">{p.nombre}</span>
            <span className="text-muted-foreground">{p.pct}%</span>
            <span>{fmtMonto(p.monto)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
