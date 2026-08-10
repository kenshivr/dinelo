"use client";

import { useSyncExternalStore } from "react";

export function fechaLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function fechaDe(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
}

export function ayerDe(hoy: string) {
  const d = fechaDe(hoy);
  d.setDate(d.getDate() - 1);
  return fechaLocal(d);
}

const formatoMesLargo = new Intl.DateTimeFormat("es-MX", { month: "long" });

export function nombreMes(mes: string) {
  return formatoMesLargo.format(fechaDe(`${mes}-01`));
}

const suscribirNada = () => () => {};

// La fecha de hoy es estado EXTERNO: en el server no existe ("") y en el cliente
// se lee al hidratar — el HTML prerenderizado nunca congela una fecha vieja.
export function useHoy() {
  return useSyncExternalStore(suscribirNada, () => fechaLocal(new Date()), () => "");
}
