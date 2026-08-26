import type { MetadataRoute } from "next";

// Sin esto, /robots.txt respondía el HTML de la app y Lighthouse lo marcaba inválido
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://dinelo.vercel.app/sitemap.xml",
  };
}
