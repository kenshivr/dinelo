import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { LandingCabecera } from "./landing-cabecera";

// La landing se ve sin cuenta: el tema se cambia desde la cabecera con el
// mismo next-themes que usa Conf dentro de la app.
const { setTheme } = vi.hoisted(() => ({ setTheme: vi.fn() }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "dark", setTheme }),
}));

// Encabezado pegajoso de la landing (odd/tasks/landing.md): el bloque amarillo
// DiNelo lleva a /landing, anclas a las secciones y Entrar / Crear cuenta. En
// pantallas chicas los enlaces viven detrás de un botón de menú.

describe("LandingCabecera", () => {
  test("el bloque DiNelo enlaza a /landing y Crear cuenta es el CTA verde", () => {
    render(<LandingCabecera />);
    const banner = screen.getByRole("banner");
    expect(within(banner).getByText("DiNelo").closest("a")).toHaveAttribute(
      "href",
      "/landing",
    );
    expect(
      within(banner).getByRole("link", { name: "Crear cuenta" }),
    ).toHaveAttribute("href", "/registro");
    expect(
      within(banner).getByRole("link", { name: "Crear cuenta" }),
    ).toHaveClass("f-gg");
    expect(
      within(banner).getByRole("link", { name: "Entrar" }),
    ).toHaveAttribute("href", "/login");
  });

  test("el menú abre y cierra las mismas anclas y avisa su estado", () => {
    render(<LandingCabecera />);
    const boton = screen.getByRole("button", { name: /menú/i });
    expect(boton).toHaveAttribute("aria-expanded", "false");
    const panel = document.getElementById("menu-landing")!;
    expect(panel).toHaveAttribute("data-abierto", "false");
    expect(panel).toHaveAttribute("inert");

    fireEvent.click(boton);
    expect(boton).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveAttribute("data-abierto", "true");
    expect(panel).not.toHaveAttribute("inert");
    expect(
      within(panel).getByRole("link", { name: "Cómo funciona" }),
    ).toHaveAttribute("href", "#como-funciona");

    fireEvent.click(within(panel).getByRole("link", { name: "Instalar" }));
    expect(boton).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("data-abierto", "false");
  });

  test("el encabezado va anclado: sin sombra Bloque", () => {
    render(<LandingCabecera />);
    expect(screen.getByRole("banner")).toHaveClass("landing-cabecera");
    expect(screen.getByRole("banner").className).not.toMatch(/shadow|nbs/);
  });

  test("el botón de tema ofrece el tema contrario y lo aplica", () => {
    render(<LandingCabecera />);
    const boton = screen.getByRole("button", { name: "Cambiar a tema claro" });
    fireEvent.click(boton);
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
