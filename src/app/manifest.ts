import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DiNelo",
    short_name: "DiNelo",
    description: "Gastos, ingresos y metas",
    start_url: "/gastos",
    display: "standalone",
    background_color: "#f2f1ec",
    theme_color: "#f2f1ec",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    // Mantener apretado el ícono (Android) salta directo a la acción; iOS los ignora.
    shortcuts: [
      {
        name: "Registrar gasto",
        url: "/gastos",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Registrar ingreso",
        url: "/ingresos",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Dash",
        url: "/dash",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
