// Pesos mexicanos: comas en miles y centavos SIEMPRE visibles — $1,500.00.
// (Decisión 2026-08-13: los 2 decimales van aunque sean .00, estilo estado de cuenta.)
const formatoMonto = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export const fmtMonto = (n: number) => formatoMonto.format(n);

export const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
