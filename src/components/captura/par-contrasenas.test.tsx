import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, test, vi } from "vitest";
import {
  CampoContrasena,
  contrasenaLista,
  MINIMO_CONTRASENA,
  ParContrasenas,
} from "./par-contrasenas";

describe("contrasenaLista — la única regla de contraseña de la app", () => {
  test("mínimo de caracteres y que coincidan", () => {
    expect(contrasenaLista("12345678", "12345678")).toBe(true);
  });

  test("corta aunque coincida", () => {
    expect(contrasenaLista("1234567", "1234567")).toBe(false);
  });

  test("larga pero distinta", () => {
    expect(contrasenaLista("12345678", "12345679")).toBe(false);
  });
});

describe("CampoContrasena — el ojito", () => {
  test("arranca oculta y el botón la muestra y la vuelve a ocultar", async () => {
    const user = userEvent.setup();
    render(
      <CampoContrasena
        value="secreta"
        onChange={vi.fn()}
        placeholder="contraseña"
      />,
    );
    const input = screen.getByPlaceholderText("contraseña");
    expect(input).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    );
    expect(input).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    );
    expect(input).toHaveAttribute("type", "password");
  });

  test("el login pide la guardada del gestor (current-password)", () => {
    render(
      <CampoContrasena
        value=""
        onChange={vi.fn()}
        placeholder="x"
        autoComplete="current-password"
      />,
    );
    expect(screen.getByPlaceholderText("x")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });
});

// El par es controlado: este envoltorio le da estado como lo hacen los forms reales.
function Par() {
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  return (
    <ParContrasenas
      nueva={nueva}
      repetida={repetida}
      onNueva={setNueva}
      onRepetida={setRepetida}
    />
  );
}

describe("ParContrasenas — pistas en vivo", () => {
  test("avisa el mínimo, luego que no coinciden, luego que sí", async () => {
    const user = userEvent.setup();
    render(<Par />);
    const [nueva, repetida] = screen.getAllByPlaceholderText(/mínimo|otra vez/);

    await user.type(nueva, "corta");
    expect(
      screen.getByText(`○ mínimo ${MINIMO_CONTRASENA} caracteres`),
    ).toBeInTheDocument();

    await user.clear(nueva);
    await user.type(nueva, "12345678");
    expect(
      screen.getByText(`✓ mínimo ${MINIMO_CONTRASENA} caracteres`),
    ).toBeInTheDocument();

    await user.type(repetida, "1234567");
    expect(screen.getByText("○ todavía no coinciden")).toBeInTheDocument();

    await user.type(repetida, "8");
    expect(screen.getByText("✓ coinciden")).toBeInTheDocument();
  });
});
