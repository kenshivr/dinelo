import { describe, expect, test } from "vitest";
import { diasEnMes, sumarMes } from "./mes";

describe("sumarMes — aritmética de 'yyyy-mm'", () => {
  test("un mes atrás dentro del mismo año", () => {
    expect(sumarMes("2026-08", -1)).toBe("2026-07");
  });

  test("cruza hacia atrás el cambio de año", () => {
    expect(sumarMes("2026-01", -1)).toBe("2025-12");
  });

  test("cruza hacia adelante el cambio de año", () => {
    expect(sumarMes("2026-12", 1)).toBe("2027-01");
  });

  test("delta cero devuelve el mismo mes", () => {
    expect(sumarMes("2026-08", 0)).toBe("2026-08");
  });

  test("saltos grandes", () => {
    expect(sumarMes("2026-08", -20)).toBe("2024-12");
    expect(sumarMes("2026-08", 17)).toBe("2028-01");
  });
});

describe("diasEnMes", () => {
  test("febrero normal y bisiesto", () => {
    expect(diasEnMes("2026-02")).toBe(28);
    expect(diasEnMes("2024-02")).toBe(29);
  });

  test("meses de 30 y 31", () => {
    expect(diasEnMes("2026-04")).toBe(30);
    expect(diasEnMes("2026-08")).toBe(31);
  });
});
