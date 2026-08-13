import { createSerwistRoute } from "@serwist/turbopack";

// Versión del precache: en Vercel viene el SHA del commit; local cae a un UUID
// nuevo por build (la ruta es force-static, se evalúa una vez al compilar).
const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  swSrc: "src/app/sw.ts",
  useNativeEsbuild: true,
});
