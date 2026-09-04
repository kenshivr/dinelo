import { describe, expect, test } from "vitest";
import {
  capitalizar,
  capitalizarPalabras,
  conComas,
  fmtMonto,
  limpiarMonto,
} from "./formato";

describe("fmtMonto — pesos con centavos siempre visibles", () => {
  test("agrupa miles y muestra dos decimales aunque sean .00", () => {
    expect(fmtMonto(1500)).toBe("$1,500.00");
  });

  test("conserva los centavos reales", () => {
    expect(fmtMonto(150.75)).toBe("$150.75");
  });

  test("cero también lleva centavos", () => {
    expect(fmtMonto(0)).toBe("$0.00");
  });
});

describe("limpiarMonto — lo que el usuario teclea → monto crudo", () => {
  test("deja dígitos y un solo punto", () => {
    expect(limpiarMonto("4750.69")).toBe("4750.69");
  });

  test("quita comas y letras", () => {
    expect(limpiarMonto("1,500")).toBe("1500");
    expect(limpiarMonto("12abc")).toBe("12");
  });

  test("recorta a dos decimales", () => {
    expect(limpiarMonto("12.345")).toBe("12.34");
  });

  test("un segundo punto se absorbe en los decimales", () => {
    expect(limpiarMonto("1.2.3")).toBe("1.23");
  });

  test("vacío o basura → vacío", () => {
    expect(limpiarMonto("")).toBe("");
    expect(limpiarMonto("abc")).toBe("");
  });
});

describe("conComas — monto crudo → lo que se ve en el input", () => {
  test("agrupa la parte entera y respeta los decimales tecleados", () => {
    expect(conComas("4750.69")).toBe("4,750.69");
    expect(conComas("1500")).toBe("1,500");
  });

  test("mantiene el punto mientras el usuario sigue escribiendo", () => {
    expect(conComas("1500.")).toBe("1,500.");
  });

  test("vacío sigue vacío", () => {
    expect(conComas("")).toBe("");
  });
});

describe("capitalizar", () => {
  test("primera letra en mayúscula, el resto igual", () => {
    expect(capitalizar("agosto")).toBe("Agosto");
  });

  test("cadena vacía no explota", () => {
    expect(capitalizar("")).toBe("");
  });
});

describe("capitalizarPalabras — conceptos de gastos e ingresos", () => {
  test("cada palabra arranca en mayúscula", () => {
    expect(capitalizarPalabras("comida con amigos")).toBe("Comida Con Amigos");
  });

  test("el resto de cada palabra queda como se tecleó", () => {
    expect(capitalizarPalabras("pago TDC")).toBe("Pago TDC");
    expect(capitalizarPalabras("iPhone")).toBe("IPhone");
  });

  test("acentos y eñes también", () => {
    expect(capitalizarPalabras("ñoquis árabes")).toBe("Ñoquis Árabes");
  });

  test("respeta espacios múltiples y de orilla sin agregar ni quitar", () => {
    expect(capitalizarPalabras(" cine  y palomitas ")).toBe(" Cine  Y Palomitas ");
  });

  test("lo que no es letra no cambia; vacío sigue vacío", () => {
    expect(capitalizarPalabras("$100 de gas")).toBe("$100 De Gas");
    expect(capitalizarPalabras("")).toBe("");
  });
});
