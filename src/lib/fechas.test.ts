import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ayerDe, fechaDe, fechaLocal, nombreMes, useHoy } from "./fechas";

describe("fechaLocal — la fecha del teléfono, sin pasar por UTC", () => {
  test("formatea yyyy-mm-dd con ceros a la izquierda", () => {
    expect(fechaLocal(new Date(2026, 7, 5))).toBe("2026-08-05");
  });

  test("ida y vuelta con fechaDe", () => {
    const d = fechaDe("2026-08-21");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 7, 21]);
    expect(fechaLocal(d)).toBe("2026-08-21");
  });
});

describe("ayerDe", () => {
  test("día anterior normal", () => {
    expect(ayerDe("2026-08-21")).toBe("2026-08-20");
  });

  test("cruza el cambio de mes y de año", () => {
    expect(ayerDe("2026-03-01")).toBe("2026-02-28");
    expect(ayerDe("2026-01-01")).toBe("2025-12-31");
  });
});

describe("nombreMes", () => {
  test("nombre largo en español", () => {
    expect(nombreMes("2026-08")).toBe("agosto");
    expect(nombreMes("2026-01")).toBe("enero");
  });
});

describe("useHoy", () => {
  test("en el cliente devuelve la fecha local de hoy", () => {
    const { result } = renderHook(() => useHoy());
    expect(result.current).toBe(fechaLocal(new Date()));
  });
});
