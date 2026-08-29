import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// LinkedIn pide ≥100 caracteres en la description
const descripcion =
  "Registra tus gastos e ingresos, organiza apartados y cumple tus metas de ahorro. DiNelo es una PWA gratuita: instálala en tu teléfono y úsala incluso sin conexión.";

export const metadata: Metadata = {
  // Base absoluta para que og:image salga con URL completa (WhatsApp no resuelve relativas)
  metadataBase: new URL("https://dinelo.vercel.app"),
  title: "DiNelo",
  description: descripcion,
  applicationName: "DiNelo",
  authors: [{ name: "Brayan Vidal Romero", url: "https://kenshivr.github.io/Brayan/" }],
  creator: "Brayan Vidal Romero",
  openGraph: {
    title: "DiNelo",
    description: descripcion,
    url: "/",
    siteName: "DiNelo",
    // "article" porque LinkedIn solo lee author/fecha de los tags article:* (el preview no cambia)
    type: "article",
    // Offset CDMX: con Z (UTC) el Inspector mostraba 12-ago 6pm al convertir la zona
    publishedTime: "2026-08-13T00:00:00-06:00",
    authors: ["Brayan Vidal Romero"],
    locale: "es_MX",
  },
  appleWebApp: {
    capable: true,
    title: "DiNelo",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#161519" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {/* El SW solo en producción: en dev cachearía de más y el puerto localhost se comparte entre proyectos. */}
        <SerwistProvider
          swUrl="/serwist/sw.js"
          disable={process.env.NODE_ENV === "development"}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
