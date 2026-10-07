import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Revelar } from "./revelar";

// Revelado de secciones al entrar (landing 1.2.0): el contenido es visible
// por defecto; el estado oculto solo se agrega tras montar y nunca con
// reduced motion, así no hay salto de layout ni contenido invisible sin JS.

type Callback = (entradas: { isIntersecting: boolean }[]) => void;

function simularObserver() {
  let callback: Callback = () => {};
  const observe = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: Callback) {
        callback = cb;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
    },
  );
  return { entra: () => callback([{ isIntersecting: true }]), disconnect };
}

function simularMovimiento(reducido: boolean) {
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: reducido && q.includes("reduce"),
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Revelar", () => {
  test("sin IntersectionObserver el contenido queda visible", () => {
    render(<Revelar>hola</Revelar>);
    expect(screen.getByText("hola")).not.toHaveAttribute("data-estado");
  });

  test("con observer: se oculta tras montar y se revela al entrar", () => {
    const obs = simularObserver();
    simularMovimiento(false);
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      top: 5000,
    } as DOMRect);
    render(<Revelar>hola</Revelar>);
    const el = screen.getByText("hola");
    expect(el).toHaveAttribute("data-estado", "pendiente");
    act(() => obs.entra());
    expect(el).toHaveAttribute("data-estado", "visto");
    expect(obs.disconnect).toHaveBeenCalled();
  });

  test("con reduced motion nunca se oculta", () => {
    simularObserver();
    simularMovimiento(true);
    render(<Revelar>hola</Revelar>);
    expect(screen.getByText("hola")).not.toHaveAttribute("data-estado");
  });
});
