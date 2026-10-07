import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LandingDemo } from "./landing-demo";

// Demo de funcionalidad (odd/tasks/landing.md): una tarjeta "Registrar gasto"
// reconstruida con bloques y, al lado, un mini Dash. Elegir un concepto deja
// el monto puesto; registrar sube Gastos, baja Saldo y mueve la barra de la
// categoría. Todo en memoria: nada se guarda.

function dash(): HTMLElement {
  return screen.getByTestId("mini-dash");
}

function bloque(label: string): HTMLElement {
  return within(dash()).getByText(label).closest(".stat") as HTMLElement;
}

describe("LandingDemo — arranque", () => {
  test("el mini Dash parte de ingresos, gastos y saldo que cuadran", () => {
    render(<LandingDemo />);
    expect(bloque("Ingresos")).toHaveTextContent(/10,000/);
    expect(bloque("Gastos")).toHaveTextContent(/1,510/);
    expect(bloque("Saldo")).toHaveTextContent(/8,490/);
    expect(bloque("Saldo")).toHaveClass("f-gg");
    expect(bloque("Gastos")).toHaveClass("f-p");
    expect(bloque("Ingresos")).toHaveClass("f-b");
  });

  test("hay tres conceptos y el monto arranca vacío", () => {
    render(<LandingDemo />);
    expect(
      screen.getAllByRole("button", { name: /Café|Camión|Cine/ }),
    ).toHaveLength(3);
    expect(screen.getByLabelText("Monto")).toHaveValue("");
  });
});

describe("LandingDemo — registrar", () => {
  test("elegir un concepto lo marca en amarillo y deja el monto puesto", () => {
    render(<LandingDemo />);
    fireEvent.click(screen.getByRole("button", { name: /Café/ }));
    expect(screen.getByRole("button", { name: /Café/ })).toHaveClass("f-y");
    expect(screen.getByLabelText("Monto")).toHaveValue("45");
  });

  test("Registrar gasto sube Gastos, baja Saldo y avisa", () => {
    render(<LandingDemo />);
    fireEvent.click(screen.getByRole("button", { name: /Café/ }));
    fireEvent.click(screen.getByRole("button", { name: /Registrar gasto/ }));
    expect(bloque("Gastos")).toHaveTextContent(/1,555/);
    expect(bloque("Saldo")).toHaveTextContent(/8,445/);
    expect(screen.getByRole("status")).toHaveTextContent(/Café/);
    expect(screen.getByRole("status")).toHaveTextContent(/45/);
  });

  test("respeta el monto que el visitante cambia y lo refleja en la categoría", () => {
    render(<LandingDemo />);
    fireEvent.click(screen.getByRole("button", { name: /Cine/ }));
    fireEvent.change(screen.getByLabelText("Monto"), {
      target: { value: "300" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Registrar gasto/ }));
    expect(bloque("Gastos")).toHaveTextContent(/1,810/);
    const diversion = within(dash())
      .getByText("Diversión")
      .closest("[data-categoria]")!;
    expect(diversion).toHaveTextContent(/\$750/);
  });

  test("Registrar sin elegir concepto no cambia nada", () => {
    render(<LandingDemo />);
    fireEvent.click(screen.getByRole("button", { name: /Registrar gasto/ }));
    expect(bloque("Gastos")).toHaveTextContent(/1,510/);
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  test("después de registrar, el concepto se suelta y el monto se limpia", () => {
    render(<LandingDemo />);
    fireEvent.click(screen.getByRole("button", { name: /Camión/ }));
    fireEvent.click(screen.getByRole("button", { name: /Registrar gasto/ }));
    expect(screen.getByRole("button", { name: /Camión/ })).not.toHaveClass(
      "f-y",
    );
    expect(screen.getByLabelText("Monto")).toHaveValue("");
  });

  test("ninguna leyenda dice que es de ejemplo o que no se guarda", () => {
    const { container } = render(<LandingDemo />);
    expect(container.textContent).not.toMatch(/ejemplo|inventad|no se guarda/i);
    expect(container.querySelector("img")).toBeNull();
  });
});
