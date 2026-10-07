import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { destinoSinSesion, esEntrada, esPublica } from "@/lib/rutas";

// Corre antes de cada request (en Next 16 middleware pasó a llamarse proxy).
// Hace DOS cosas: refrescar la sesión (getUser renueva el token vencido y lo
// escribe en cookies — un Server Component no puede) y cuidar la puerta:
// sin sesión todo redirige a /login (la raíz sirve la landing); con sesión
// /login redirige a /gastos. Qué es público vive en lib/rutas.ts.
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          respuesta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Nada de lógica entre crear el cliente y getUser: es la llamada que refresca.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ruta = request.nextUrl.pathname;

  if (!user && !esPublica(ruta)) {
    const url = request.nextUrl.clone();
    // La raíz se REESCRIBE (no redirige): sin sesión "/" sirve la landing
    // (1.2.0; antes servía el login) sin salto extra — el 307 costaba ~800ms
    // de LCP en móvil. Rutas profundas sí redirigen para que la URL visible
    // sea /login.
    const destino = destinoSinSesion(ruta);
    url.pathname = destino.pathname;
    const redireccion =
      destino.modo === "rewrite"
        ? NextResponse.rewrite(url, { request })
        : NextResponse.redirect(url);
    // conservar las cookies que setAll haya escrito (p. ej. limpieza de sesión vencida)
    respuesta.cookies
      .getAll()
      .forEach((cookie) => redireccion.cookies.set(cookie));
    return redireccion;
  }

  if (user && esEntrada(ruta)) {
    const url = request.nextUrl.clone();
    url.pathname = "/gastos";
    const redireccion = NextResponse.redirect(url);
    respuesta.cookies
      .getAll()
      .forEach((cookie) => redireccion.cookies.set(cookie));
    return redireccion;
  }

  return respuesta;
}

export const config = {
  // Todo salvo estáticos, imágenes, el manifest PWA y los archivos para bots:
  // robots.txt, sitemap.xml, llms.txt y la og:image (.jpg) también deben salir
  // sin sesión — si pasan por el proxy terminan redirigidos a /login.
  matcher: [
    "/((?!_next/static|_next/image|manifest\\.webmanifest|.*\\.(?:png|ico|svg|jpg|jpeg|webp|txt|xml)$).*)",
  ],
};
