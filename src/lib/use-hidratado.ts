"use client";

import { useSyncExternalStore } from "react";

const suscribirNada = () => () => {};

// true solo después de hidratar — para estado que el server no conoce
// (p. ej. el tema elegido, que vive en localStorage vía next-themes)
export function useHidratado() {
  return useSyncExternalStore(
    suscribirNada,
    () => true,
    () => false,
  );
}
