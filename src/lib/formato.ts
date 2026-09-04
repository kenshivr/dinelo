// Pesos mexicanos: comas en miles y centavos SIEMPRE visibles — $1,500.00.
// (Decisión 2026-08-13: los 2 decimales van aunque sean .00, estilo estado de cuenta.)
const formatoMonto = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const fmtMonto = (n: number) => formatoMonto.format(n);

// Para INPUTS de monto — crudo = dígitos y un punto, máx 2 decimales ("4750.69").
// El estado guarda el crudo (Number() directo); la vista lo muestra con comas.
export function limpiarMonto(texto: string) {
  const [entera, ...resto] = texto.replace(/[^\d.]/g, "").split(".");
  return resto.length ? `${entera}.${resto.join("").slice(0, 2)}` : entera;
}

export function conComas(crudo: string) {
  const [entera, decimales] = crudo.split(".");
  const agrupada = entera
    ? Number(entera).toLocaleString("es-MX", { maximumFractionDigits: 0 })
    : "";
  return decimales !== undefined ? `${agrupada}.${decimales}` : agrupada;
}

export const capitalizar = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

// "comida con amigos" → "Comida Con Amigos": cada palabra arranca en mayúscula y
// el resto queda como se tecleó ("iPhone" no se toca, "TDC" sigue en mayúsculas).
// Regla para conceptos de gastos/ingresos (2026-09-04): se aplica al GUARDAR, en
// las server actions, para que todos los caminos (captura, editar, frecuentes,
// pagar apartado) escriban igual.
export const capitalizarPalabras = (s: string) =>
  s.replace(/(^|\s)(\S)/g, (_, sep: string, letra: string) => sep + letra.toUpperCase());
