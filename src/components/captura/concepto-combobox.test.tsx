import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { Frecuente } from "@/lib/tipos";
import { ConceptoCombobox } from "./concepto-combobox";

const frecuentes: Frecuente[] = [
  { id: "f1", nombre: "Renta", emoji: "🏠", tipo: "G" },
  { id: "f2", nombre: "Café", emoji: "☕", tipo: "G" },
];

function montar(
  props: Partial<React.ComponentProps<typeof ConceptoCombobox>> = {},
) {
  const onChange = vi.fn();
  render(
    <ConceptoCombobox
      value=""
      onChange={onChange}
      frecuentes={frecuentes}
      tipo="G"
      placeholder="Cine, Comida, Ropa…"
      {...props}
    />,
  );
  return { onChange };
}

describe("ConceptoCombobox", () => {
  test("escribir no abre la lista: solo la flechita", async () => {
    const user = userEvent.setup();
    const { onChange } = montar();

    await user.type(screen.getByPlaceholderText("Cine, Comida, Ropa…"), "Ta");
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByText(/Renta/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Mis frecuentes" }));
    expect(screen.getByText(/Renta/)).toBeInTheDocument();
    expect(screen.getByText(/Café/)).toBeInTheDocument();
  });

  test("elegir un frecuente llena el concepto y cierra la lista", async () => {
    const user = userEvent.setup();
    const { onChange } = montar();

    await user.click(screen.getByRole("button", { name: "Mis frecuentes" }));
    await user.click(screen.getByText(/Café/));

    expect(onChange).toHaveBeenLastCalledWith("Café");
    expect(screen.queryByText(/Renta/)).not.toBeInTheDocument();
  });

  test("sin frecuentes invita a crear uno del tipo correcto", async () => {
    const user = userEvent.setup();
    montar({ frecuentes: [], tipo: "I" });

    await user.click(screen.getByRole("button", { name: "Mis frecuentes" }));
    expect(
      screen.getByRole("link", { name: /ingreso frecuente/ }),
    ).toHaveAttribute("href", "/cuenta/configuracion");
  });
});
