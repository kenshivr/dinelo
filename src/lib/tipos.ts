// Tipos del dominio. Espejo del esquema de Supabase (supabase/esquema.sql).

// Paleta validada 2026-08-14 (OKLab, todos los pares nuevos a ΔE ≥ 12.8): los 6
// originales intactos + 9 nuevos. Todos aguantan texto negro encima (regla Bloque).
export type ColorBloque =
  | "f-y" | "f-p" | "f-g" | "f-gg" | "f-b" | "f-r"
  | "f-o" | "f-l" | "f-t" | "f-c" | "f-v" | "f-f" | "f-m" | "f-ca" | "f-n";

// Hex de cada color de bloque — para SVG, donde las clases f-* no aplican
export const colorBloque: Record<ColorBloque, string> = {
  "f-y": "#facc15",
  "f-p": "#f9a8d4",
  "f-g": "#bbf7d0",
  "f-gg": "#4ade80",
  "f-b": "#93c5fd",
  "f-r": "#fca5a5",
  "f-o": "#f97316", // naranja
  "f-l": "#65a30d", // oliva
  "f-t": "#14b8a6", // turquesa
  "f-c": "#0ea5e9", // cielo
  "f-v": "#8b5cf6", // violeta
  "f-f": "#e879f9", // fucsia
  "f-m": "#ec4899", // rosa mexicano
  "f-ca": "#a8a29e", // café
  "f-n": "#d4d4d8", // gris
};

export type Categoria = { id: string; nombre: string; color: ColorBloque };
export type Medio = { id: string; nombre: string; emoji: string; tipo: string };
export type Frecuente = { id: string; nombre: string; emoji: string; tipo: "G" | "I" };
export type Meta = { id: string; nombre: string; descripcion: string; objetivo: number };
export type Aporte = { id: string; metaId: string; medioId: string; monto: number; fecha: string }; // yyyy-mm-dd
export type Perfil = {
  id: string;
  nombre: string;
  inicial: string;
  color: ColorBloque;
  email: string;
  desde: string; // se deriva del created_at de Supabase
};
export type Movimiento = {
  id: string;
  tipo: "gasto" | "ingreso";
  concepto: string;
  monto: number;
  categoriaId?: string; // solo gastos
  medioId: string;
  fecha: string; // yyyy-mm-dd
};

// Fila de la tabla movimientos (snake_case) → tipo del dominio
export function movimientoDeFila(fila: {
  id: string;
  user_id: string;
  tipo: string;
  concepto: string;
  monto: number;
  categoria_id: string | null;
  medio_id: string;
  fecha: string;
}): Movimiento {
  return {
    id: fila.id,
    tipo: fila.tipo as Movimiento["tipo"],
    concepto: fila.concepto,
    monto: fila.monto,
    categoriaId: fila.categoria_id ?? undefined,
    medioId: fila.medio_id,
    fecha: fila.fecha,
  };
}
