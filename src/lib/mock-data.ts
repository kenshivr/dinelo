// Datos de mentira para la fase local. Se reemplazan por Supabase en la fase 2.

export type ColorBloque = "f-y" | "f-p" | "f-g" | "f-gg" | "f-b" | "f-r";

export type Categoria = { id: string; nombre: string; color: ColorBloque };
export type Medio = { id: string; nombre: string; emoji: string };
export type Frecuente = { id: string; nombre: string; emoji: string; tipo: "G" | "I" };

export const categorias: Categoria[] = [
  { id: "c1", nombre: "Comida", color: "f-y" },
  { id: "c2", nombre: "Súper", color: "f-p" },
  { id: "c3", nombre: "Transporte", color: "f-b" },
  { id: "c4", nombre: "Salidas", color: "f-gg" },
  { id: "c5", nombre: "Casa", color: "f-g" },
];

export const medios: Medio[] = [
  { id: "m1", nombre: "Efectivo", emoji: "💵" },
  { id: "m2", nombre: "BBVA", emoji: "🏦" },
  { id: "m3", nombre: "NU · Débito", emoji: "💳" },
];

export const frecuentes: Frecuente[] = [
  { id: "f1", nombre: "Tacos de la esquina", emoji: "🌮", tipo: "G" },
  { id: "f2", nombre: "Gasolina", emoji: "⛽", tipo: "G" },
  { id: "f3", nombre: "Renta", emoji: "🏠", tipo: "G" },
  { id: "f4", nombre: "Quincena", emoji: "💼", tipo: "I" },
];
