import { describe, expect, test } from "vitest";
import { enumerar } from "./texto";

describe("enumerar — listas en español para mensajes al usuario", () => {
  test("vacía → cadena vacía", () => {
    expect(enumerar([])).toBe("");
  });

  test("un elemento va solo", () => {
    expect(enumerar(["el monto"])).toBe("el monto");
  });

  test("dos elementos se unen con 'y'", () => {
    expect(enumerar(["el concepto", "el monto"])).toBe(
      "el concepto y el monto",
    );
  });

  test("tres o más: comas y 'y' al final", () => {
    expect(enumerar(["a", "b", "c"])).toBe("a, b y c");
  });
});
