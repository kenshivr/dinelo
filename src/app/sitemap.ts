import type { MetadataRoute } from "next";

// Solo las rutas públicas: el resto vive detrás del login
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/login", "/registro", "/recuperar", "/privacidad", "/terminos"].map(
    (ruta) => ({
      url: `https://dinelo.vercel.app${ruta}`,
    }),
  );
}
