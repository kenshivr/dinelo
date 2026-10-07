// Puerta del proxy, como funciones puras para poder probarlas sin Supabase
// (landing 1.2.0, odd/tasks/landing.md).

// pantallas de entrada: con sesión no tienen sentido (y /registro encima
// pisaría la sesión actual con una cuenta nueva) → a /gastos
export function esEntrada(ruta: string): boolean {
  return (
    ruta.startsWith("/login") ||
    ruta.startsWith("/registro") ||
    ruta.startsWith("/recuperar")
  );
}

// el destino de los enlaces de correo, el service worker, la página offline
// (el navegador los pide sin contexto de app), las páginas legales (linkeadas
// desde fuera de la app) y la landing van SIN sesión
export function esPublica(ruta: string): boolean {
  return (
    esEntrada(ruta) ||
    ruta.startsWith("/auth") ||
    ruta.startsWith("/serwist") ||
    ruta.startsWith("/~offline") ||
    ruta.startsWith("/privacidad") ||
    ruta.startsWith("/terminos") ||
    ruta.startsWith("/landing")
  );
}

// Sin sesión, la raíz se REESCRIBE (no redirige) a la landing: se sirve en
// "/" sin salto extra — el 307 costaba ~800ms de LCP en móvil. Rutas
// profundas sí redirigen para que la URL visible sea /login.
export function destinoSinSesion(ruta: string): {
  pathname: "/landing" | "/login";
  modo: "rewrite" | "redirect";
} {
  return ruta === "/"
    ? { pathname: "/landing", modo: "rewrite" }
    : { pathname: "/login", modo: "redirect" };
}
