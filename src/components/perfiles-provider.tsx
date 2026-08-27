"use client";

import { createContext, useContext } from "react";
import type { ColorBloque } from "@/lib/tipos";

export type PerfilHeader = {
  id: string;
  nombre: string;
  inicial: string;
  color: ColorBloque;
  avatarUrl: string | null;
};

// Los perfiles se cargan UNA vez en el layout de (tabs) y viajan por contexto:
// así el PageHeader de cualquier vista muestra al usuario real sin fetch propio.
const PerfilesContext = createContext<{
  perfiles: PerfilHeader[];
  miId: string;
}>({
  perfiles: [],
  miId: "",
});

export function usePerfiles() {
  const { perfiles, miId } = useContext(PerfilesContext);
  return { perfiles, mio: perfiles.find((p) => p.id === miId) ?? null };
}

export function PerfilesProvider({
  perfiles,
  miId,
  children,
}: {
  perfiles: PerfilHeader[];
  miId: string;
  children: React.ReactNode;
}) {
  return (
    <PerfilesContext.Provider value={{ perfiles, miId }}>
      {children}
    </PerfilesContext.Provider>
  );
}
