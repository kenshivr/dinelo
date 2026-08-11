// Datos de mentira para la fase local. Se reemplazan por Supabase en la fase 2.
// Los tipos viven en tipos.ts; se re-exportan aquí mientras queden vistas en mock.

import type { Categoria, Frecuente, Medio, Movimiento, Perfil } from "./tipos";

export type { Categoria, ColorBloque, Frecuente, Medio, Movimiento, Perfil } from "./tipos";
export { colorBloque } from "./tipos";

export const categorias: Categoria[] = [
  { id: "c1", nombre: "Comida", color: "f-y" },
  { id: "c2", nombre: "Súper", color: "f-p" },
  { id: "c3", nombre: "Transporte", color: "f-b" },
  { id: "c4", nombre: "Salidas", color: "f-gg" },
  { id: "c5", nombre: "Casa", color: "f-g" },
];

export const medios: Medio[] = [
  { id: "m1", nombre: "Efectivo", emoji: "💵", tipo: "cash" },
  { id: "m2", nombre: "BBVA", emoji: "🏦", tipo: "débito" },
  { id: "m3", nombre: "NU", emoji: "💳", tipo: "débito" },
];

export const frecuentes: Frecuente[] = [
  { id: "f1", nombre: "Tacos de la esquina", emoji: "🌮", tipo: "G" },
  { id: "f2", nombre: "Gasolina", emoji: "⛽", tipo: "G" },
  { id: "f3", nombre: "Renta", emoji: "🏠", tipo: "G" },
  { id: "f4", nombre: "Quincena", emoji: "💼", tipo: "I" },
];

export const perfiles: Perfil[] = [
  { id: "b", nombre: "Brayan", inicial: "B", color: "f-y", email: "brayan@dinelo.app", desde: "ago 2026" },
  { id: "n", nombre: "Nelo", inicial: "N", color: "f-p", email: "nelo@dinelo.app", desde: "ago 2026" },
];

// Agosto 2026, de ambos. Totales del mock: ingresos $18,400 · gastos $7,350.
export const movimientos: Movimiento[] = [
  { id: "mv01", perfilId: "b", tipo: "gasto", concepto: "Tacos de la esquina", monto: 250, categoriaId: "c1", medioId: "m3", fecha: "2026-08-10" },
  { id: "mv02", perfilId: "n", tipo: "gasto", concepto: "Uber al centro", monto: 180, categoriaId: "c3", medioId: "m1", fecha: "2026-08-10" },
  { id: "mv03", perfilId: "b", tipo: "ingreso", concepto: "Quincena", monto: 4500, medioId: "m2", fecha: "2026-08-09" },
  { id: "mv04", perfilId: "n", tipo: "gasto", concepto: "Súper Chedraui", monto: 620, categoriaId: "c2", medioId: "m2", fecha: "2026-08-09" },
  { id: "mv05", perfilId: "n", tipo: "ingreso", concepto: "Quincena", monto: 4600, medioId: "m2", fecha: "2026-08-09" },
  { id: "mv06", perfilId: "n", tipo: "gasto", concepto: "Comida corrida", monto: 380, categoriaId: "c1", medioId: "m1", fecha: "2026-08-08" },
  { id: "mv07", perfilId: "n", tipo: "gasto", concepto: "Cine", monto: 480, categoriaId: "c4", medioId: "m3", fecha: "2026-08-08" },
  { id: "mv08", perfilId: "b", tipo: "gasto", concepto: "Pizza del viernes", monto: 520, categoriaId: "c1", medioId: "m3", fecha: "2026-08-07" },
  { id: "mv09", perfilId: "b", tipo: "gasto", concepto: "Gasolina", monto: 800, categoriaId: "c3", medioId: "m2", fecha: "2026-08-07" },
  { id: "mv10", perfilId: "b", tipo: "gasto", concepto: "Súper Walmart", monto: 740, categoriaId: "c2", medioId: "m2", fecha: "2026-08-06" },
  { id: "mv11", perfilId: "n", tipo: "gasto", concepto: "Desayuno", monto: 310, categoriaId: "c1", medioId: "m1", fecha: "2026-08-05" },
  { id: "mv12", perfilId: "n", tipo: "gasto", concepto: "Gas de la casa", monto: 450, categoriaId: "c5", medioId: "m1", fecha: "2026-08-05" },
  { id: "mv13", perfilId: "n", tipo: "gasto", concepto: "Frutería", monto: 440, categoriaId: "c2", medioId: "m1", fecha: "2026-08-04" },
  { id: "mv14", perfilId: "b", tipo: "gasto", concepto: "Metro", monto: 220, categoriaId: "c3", medioId: "m1", fecha: "2026-08-04" },
  { id: "mv15", perfilId: "b", tipo: "gasto", concepto: "Tacos de la esquina", monto: 250, categoriaId: "c1", medioId: "m1", fecha: "2026-08-03" },
  { id: "mv16", perfilId: "b", tipo: "gasto", concepto: "Focos para la sala", monto: 400, categoriaId: "c5", medioId: "m3", fecha: "2026-08-03" },
  { id: "mv17", perfilId: "n", tipo: "gasto", concepto: "Sushi", monto: 690, categoriaId: "c1", medioId: "m3", fecha: "2026-08-02" },
  { id: "mv18", perfilId: "b", tipo: "gasto", concepto: "Boliche", monto: 620, categoriaId: "c4", medioId: "m2", fecha: "2026-08-02" },
  { id: "mv19", perfilId: "b", tipo: "ingreso", concepto: "Quincena", monto: 4700, medioId: "m2", fecha: "2026-08-01" },
  { id: "mv20", perfilId: "n", tipo: "ingreso", concepto: "Quincena", monto: 4600, medioId: "m2", fecha: "2026-08-01" },
];
