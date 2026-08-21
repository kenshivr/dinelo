import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { registrarGasto as registrarGastoReal } from "@/app/(tabs)/gastos/acciones";
import { fechaLocal } from "@/lib/fechas";
import type { Categoria, Medio } from "@/lib/tipos";
import { GastosForm } from "./gastos-form";

// Lo que el form necesita del mundo exterior, aislado: el server action y el toast.
const { registrarGasto, toast } = vi.hoisted(() => ({
  registrarGasto: vi.fn<typeof registrarGastoReal>(),
  toast: vi.fn(),
}));

vi.mock("@/app/(tabs)/gastos/acciones", () => ({ registrarGasto, crearCategoria: vi.fn() }));
vi.mock("@/components/toast", () => ({ useToast: () => toast }));
// PageHeader lee el perfil de un contexto que aquí no existe
vi.mock("@/components/page-header", () => ({
  PageHeader: ({ title }: { title: React.ReactNode }) => <h1>{title}</h1>,
}));

const categorias: Categoria[] = [
  { id: "c1", nombre: "Comida", color: "f-y" },
  { id: "c2", nombre: "Transporte", color: "f-b" },
];
const medios: Medio[] = [{ id: "m1", nombre: "Efectivo", emoji: "💵", tipo: "" }];

function montar() {
  render(<GastosForm categorias={categorias} medios={medios} frecuentes={[]} />);
  return {
    concepto: screen.getByPlaceholderText("Cine, Comida, Ropa…"),
    monto: screen.getByPlaceholderText("0"),
    registrar: screen.getByRole("button", { name: "Registrar gasto" }),
  };
}

beforeEach(() => {
  registrarGasto.mockReset().mockResolvedValue(null);
  toast.mockReset();
});

describe("GastosForm — validación antes de tocar el servidor", () => {
  test("sin nada: avisa los dos faltantes, enfoca el concepto y no llama al server", async () => {
    const user = userEvent.setup();
    const { concepto, registrar } = montar();

    await user.click(registrar);

    expect(toast).toHaveBeenCalledWith("Te faltan el concepto y el monto para registrar", "error");
    expect(concepto).toHaveFocus();
    expect(registrarGasto).not.toHaveBeenCalled();
  });

  test("solo falta el monto: el foco va al monto", async () => {
    const user = userEvent.setup();
    const { concepto, monto, registrar } = montar();

    await user.type(concepto, "Tacos");
    await user.click(registrar);

    expect(toast).toHaveBeenCalledWith("Te falta el monto para registrar", "error");
    expect(monto).toHaveFocus();
    expect(registrarGasto).not.toHaveBeenCalled();
  });
});

describe("GastosForm — registrar", () => {
  test("manda concepto, monto, categoría elegida, sin medio y la fecha del teléfono; luego limpia", async () => {
    const user = userEvent.setup();
    const { concepto, monto, registrar } = montar();

    await user.type(concepto, "  Tacos ");
    await user.type(monto, "120.5");
    await user.click(screen.getByRole("button", { name: "Comida" }));
    await user.click(registrar);

    await waitFor(() =>
      expect(registrarGasto).toHaveBeenCalledWith({
        concepto: "Tacos",
        monto: 120.5,
        categoriaId: "c1",
        medioId: null,
        fecha: fechaLocal(new Date()),
      }),
    );
    expect(toast).toHaveBeenCalledWith("¡Gasto registrado!");
    expect(concepto).toHaveValue("");
    expect(monto).toHaveValue("");
  });

  test("tocar la categoría elegida la quita: el gasto va sin categoría", async () => {
    const user = userEvent.setup();
    const { concepto, monto, registrar } = montar();

    await user.type(concepto, "Misterio");
    await user.type(monto, "50");
    const comida = screen.getByRole("button", { name: "Comida" });
    await user.click(comida);
    await user.click(comida);
    await user.click(registrar);

    await waitFor(() => expect(registrarGasto).toHaveBeenCalled());
    expect(registrarGasto.mock.calls[0][0]).toMatchObject({ categoriaId: null });
  });

  test("si el server falla, el error se muestra y el form conserva lo tecleado", async () => {
    registrarGasto.mockResolvedValue("No se pudo registrar. Intenta de nuevo.");
    const user = userEvent.setup();
    const { concepto, monto, registrar } = montar();

    await user.type(concepto, "Tacos");
    await user.type(monto, "120");
    await user.click(registrar);

    await waitFor(() => expect(toast).toHaveBeenCalledWith("No se pudo registrar. Intenta de nuevo.", "error"));
    expect(concepto).toHaveValue("Tacos");
  });
});
