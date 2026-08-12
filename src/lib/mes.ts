// Aritmética de meses "yyyy-mm" — módulo puro, lo importan server y cliente
// (fechas.ts es "use client" por useHoy; esto tiene que poder correr en el server)

export function sumarMes(mes: string, delta: number) {
  const [a, m] = mes.split("-").map(Number);
  const total = a * 12 + m - 1 + delta;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

export function diasEnMes(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  return new Date(a, m, 0).getDate();
}
