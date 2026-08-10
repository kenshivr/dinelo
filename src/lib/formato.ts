const formatoMonto = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

export const fmtMonto = (n: number) => `$${formatoMonto.format(n)}`;

export const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
