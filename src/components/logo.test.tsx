import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Logo } from "./logo";

// El logo de la app (el bloque amarillo DiNelo) lleva SIEMPRE a la landing,
// esté donde esté: pantallas de entrada, legales, offline y el encabezado de
// las tabs (landing 1.2.0, odd/tasks/landing.md).

describe("Logo", () => {
  test("el bloque grande es un enlace a /landing con el texto DiNelo", () => {
    render(<Logo />);
    const enlace = screen.getByRole("link", { name: "DiNelo" });
    expect(enlace).toHaveAttribute("href", "/landing");
    expect(enlace).toHaveClass("f-y");
  });

  test("la versión chica del encabezado también enlaza a /landing", () => {
    render(<Logo tamano="chico" />);
    const enlace = screen.getByRole("link", { name: "DiNelo" });
    expect(enlace).toHaveAttribute("href", "/landing");
    expect(enlace).not.toHaveClass("f-y");
  });
});
