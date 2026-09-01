import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Vercel solo manda HSTS; estos cubren iframes, MIME sniffing, referrer y
  // sensores. CSP queda fuera a propósito: los scripts inline de Next piden
  // nonces y es un proyecto aparte.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  experimental: {
    // Velocidad etapa 1: el cliente reusa 60s las tabs ya visitadas — volver a
    // una tab es instantáneo, sin skeleton. Las server actions con
    // revalidatePath siguen refrescando el caché al capturar/editar.
    staleTimes: {
      dynamic: 60,
    },
  },
};

export default withSerwist(nextConfig);
