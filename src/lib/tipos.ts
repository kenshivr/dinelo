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
  perfilId: string;
  tipo: "gasto" | "ingreso";
  concepto: string;
  monto: number;
  categoriaId?: string; // solo gastos
  medioId: string;
  fecha: string; // yyyy-mm-dd
};
