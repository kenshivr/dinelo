// "a" · "a y b" · "a, b y c" — para enumerar en mensajes al usuario
export function enumerar(items: string[]) {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} y ${items.at(-1)}`;
}
