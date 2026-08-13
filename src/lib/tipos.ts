// Tipos del dominio. Espejo del esquema de Supabase (supabase/esquema.sql).

export type ColorBloque = "f-y" | "f-p" | "f-g" | "f-gg" | "f-b" | "f-r";

// Hex de cada color de bloque — para SVG, donde las clases f-* no aplican
export const colorBloque: Record<ColorBloque, string> = {
  "f-y": "#facc15",
  "f-p": "#f9a8d4",
  "f-g": "#bbf7d0",
  "f-gg": "#4ade80",
  "f-b": "#93c5fd",
  "f-r": "#fca5a5",
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
