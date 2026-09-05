import { describe, expect, test } from "vitest";
import { saldoActual, saldosPorMedio, type MovimientoDeSaldo } from "./saldos";
import type { Medio } from "./tipos";

const medio = (id: string, saldoInicial = 0): Medio => ({
  id,
  nombre: id,
  emoji: "💵",
  tipo: "",
  saldoInicial,
});

describe("saldosPorMedio — inicial + movimientos + transferencias", () => {
  test("sin movimientos, cada medio muestra su saldo inicial", () => {
    const saldos = saldosPorMedio(
      [medio("banco", 1500), medio("efectivo")],
      [],
      [],
    );
    expect(saldos).toEqual({ banco: 1500, efectivo: 0 });
  });

  test("los ingresos suman y los gastos restan en su medio", () => {
    const saldos = saldosPorMedio(
      [medio("banco", 100)],
      [
        { tipo: "ingreso", monto: 500, medioId: "banco" },
        { tipo: "gasto", monto: 200, medioId: "banco" },
      ],
      [],
    );
    expect(saldos.banco).toBe(400);
  });

  test("los movimientos Sin medio no suman a ninguna card", () => {
    const saldos = saldosPorMedio(
      [medio("banco")],
      [{ tipo: "ingreso", monto: 500, medioId: null }],
      [],
    );
    expect(saldos.banco).toBe(0);
  });

  test("una transferencia resta en el origen y suma en el destino", () => {
    const saldos = saldosPorMedio(
      [medio("banco", 1000), medio("efectivo")],
      [],
      [{ origenId: "banco", destinoId: "efectivo", monto: 300 }],
    );
    expect(saldos).toEqual({ banco: 700, efectivo: 300 });
  });

  test("si el origen fue borrado, el destino igual recibe (el dinero sí llegó)", () => {
    const saldos = saldosPorMedio(
      [medio("efectivo")],
      [],
      [{ origenId: null, destinoId: "efectivo", monto: 300 }],
    );
    expect(saldos.efectivo).toBe(300);
  });

  test("una punta hacia un medio que ya no existe no explota ni cuenta", () => {
    const saldos = saldosPorMedio(
      [medio("banco", 500)],
      [],
      [{ origenId: "banco", destinoId: "viejo", monto: 100 }],
    );
    expect(saldos).toEqual({ banco: 400 });
  });
});

describe("saldoActual — Saldo del Dash: ingresos − gastos de todo el historial", () => {
  test("sin movimientos es cero", () => {
    expect(saldoActual([])).toBe(0);
  });

  test("suma todos los ingresos y resta todos los gastos", () => {
    const saldo = saldoActual([
      { tipo: "ingreso", monto: 1000 },
      { tipo: "ingreso", monto: 250 },
      { tipo: "gasto", monto: 300 },
    ]);
    expect(saldo).toBe(950);
  });

  test("el medio no importa: lo Sin medio o de un medio borrado cuenta igual", () => {
    const movimientos: MovimientoDeSaldo[] = [
      { tipo: "ingreso", monto: 500, medioId: null },
      { tipo: "gasto", monto: 100, medioId: "viejo" },
    ];
    expect(saldoActual(movimientos)).toBe(400);
  });

  test("gastar más de lo que entró deja el saldo en negativo", () => {
    const saldo = saldoActual([
      { tipo: "ingreso", monto: 100 },
      { tipo: "gasto", monto: 250 },
    ]);
    expect(saldo).toBe(-150);
  });
});
