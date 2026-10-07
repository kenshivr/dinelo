import type { MetadataRoute } from "next";
import { SITIO } from "@/lib/sitio";

// Solo las rutas públicas: el resto vive detrás del login. La landing se
// sirve en "/" sin sesión (proxy), así que "/" es la portada y /landing su
// ruta propia.
export default function sitemap(): MetadataRoute.Sitemap {
  const paginas: [string, number][] = [
    ["/", 1],
    ["/landing", 0.9],
    ["/registro", 0.8],
    ["/login", 0.5],
    ["/recuperar", 0.3],
    ["/privacidad", 0.3],
    ["/terminos", 0.3],
  ];
  return paginas.map(([ruta, priority]) => ({
    url: `${SITIO}${ruta}`,
    lastModified: new Date("2026-10-07"),
    priority,
  }));
}
