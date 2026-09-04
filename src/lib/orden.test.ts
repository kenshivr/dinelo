import { describe, expect, test } from "vitest";
import { moverVecino } from "./orden";

describe("moverVecino — las flechas ▲/▼ de Configuración › Ordenar", () => {
  const lista = ["a", "b", "c"];

  test("▼ baja un elemento un lugar", () => {
    expect(moverVecino(lista, 0, 1)).toEqual(["b", "a", "c"]);
  });

  test("▲ sube un elemento un lugar", () => {
    expect(moverVecino(lista, 2, -1)).toEqual(["a", "c", "b"]);
  });

  test("en la orilla no hay a dónde ir", () => {
    expect(moverVecino(lista, 0, -1)).toBeNull();
    expect(moverVecino(lista, 2, 1)).toBeNull();
  });

  test("no muta la lista original", () => {
    moverVecino(lista, 0, 1);
    expect(lista).toEqual(["a", "b", "c"]);
  });
});
