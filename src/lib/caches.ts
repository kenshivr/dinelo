// El SW (Serwist) guarda en CacheStorage páginas y datos ya vistos hasta 24h;
// al cerrar sesión o borrar la cuenta no deben sobrevivir en el dispositivo
// (un teléfono prestado seguiría mostrando tus números estando offline).
export async function limpiarCachesDelNavegador() {
  if (typeof window === "undefined" || !("caches" in window)) return;
  try {
    const claves = await caches.keys();
    await Promise.all(claves.map((clave) => caches.delete(clave)));
  } catch {
    // navegador sin acceso a storage: no hay nada que borrar
  }
}
