import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
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
