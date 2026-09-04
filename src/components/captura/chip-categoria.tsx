import { cn } from "@/lib/utils";
import { colorBloque, type Categoria } from "@/lib/tipos";

type Props = {
  categoria: Categoria;
  activa: boolean;
  onClick: () => void;
};

// Chip de categoría (2026-09-04, pedido de Brayan): viste borde, letra y sombra
// del color de su categoría (.chip-cat con --cat); la activa se rellena con ese
// mismo color y vuelve al negro Bloque. Un solo look para Gastos, Editar
// movimiento, Pagar apartado y Nuevo apartado.
export function ChipCategoria({ categoria, activa, onClick }: Props) {
  return (
    <button
      className={cn("chip", activa ? categoria.color : "chip-cat")}
      style={{ "--cat": colorBloque[categoria.color] } as React.CSSProperties}
      onClick={onClick}
    >
      {categoria.nombre}
    </button>
  );
}
