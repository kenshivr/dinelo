import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  // Base absoluta para que og:image salga con URL completa (WhatsApp no resuelve relativas)
  metadataBase: new URL("https://dinelo.vercel.app"),
  title: "DiNelo",
  description: "Gastos, ingresos y metas",
  applicationName: "DiNelo",
  openGraph: {
    title: "DiNelo",
    description: "Gastos, ingresos y metas",
    url: "/",
    siteName: "DiNelo",
    type: "website",
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
