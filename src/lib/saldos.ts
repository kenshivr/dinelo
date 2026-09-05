import type { Medio, Transferencia } from "@/lib/tipos";

// Lo que Control › Medios necesita del movimiento: nada de concepto ni categoría
export type MovimientoDeSaldo = {
  tipo: "gasto" | "ingreso";
  monto: number;
  medioId: string | null;
};

// Saldo por medio: inicial + ingresos − gastos + transferencias que entran − las
// que salen. Lo "Sin medio" (movimiento sin medio o punta borrada de una
// transferencia) no se puede atribuir a nadie: no suma en ninguna card.
export function saldosPorMedio(
  medios: Medio[],
  movimientos: MovimientoDeSaldo[],
  transferencias: Pick<Transferencia, "origenId" | "destinoId" | "monto">[],
): Record<string, number> {
  const saldos: Record<string, number> = {};
  for (const m of medios) saldos[m.id] = m.saldoInicial ?? 0;

  for (const mov of movimientos) {
    if (!mov.medioId || !(mov.medioId in saldos)) continue;
    saldos[mov.medioId] += mov.tipo === "ingreso" ? mov.monto : -mov.monto;
  }

  for (const t of transferencias) {
    if (t.origenId && t.origenId in saldos) saldos[t.origenId] -= t.monto;
    if (t.destinoId && t.destinoId in saldos) saldos[t.destinoId] += t.monto;
  }

  return saldos;
}

// Saldo del Dash: todo lo que entró menos todo lo que salió, de siempre. A
// propósito NO mira el saldo inicial de los medios ni las transferencias
// (decisión de Brayan 2026-09-05): es la cuenta que se comprueba movimiento por
// movimiento, sin importar el mes visible ni cómo esté repartido en los medios.
export function saldoActual(
  movimientos: Pick<MovimientoDeSaldo, "tipo" | "monto">[],
): number {
  return movimientos.reduce(
    (s, m) => s + (m.tipo === "ingreso" ? m.monto : -m.monto),
    0,
  );
}
