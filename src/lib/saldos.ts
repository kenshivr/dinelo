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
