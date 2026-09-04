// Intercambia el elemento i con su vecino (−1 = arriba, +1 = abajo) sin mutar la
// lista original. En la orilla no hay vecino → null: el botón no hace nada.
// Es lo que hace cada flecha ▲/▼ en Configuración › Ordenar (2026-09-04).
export function moverVecino<T>(
  lista: T[],
  i: number,
  delta: -1 | 1,
): T[] | null {
  const j = i + delta;
  if (i < 0 || i >= lista.length || j < 0 || j >= lista.length) return null;
  const nueva = [...lista];
  [nueva[i], nueva[j]] = [nueva[j], nueva[i]];
  return nueva;
}
