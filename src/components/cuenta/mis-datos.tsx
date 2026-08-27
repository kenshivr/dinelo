"use client";

import { useState } from "react";
import { chevronDer } from "@/components/icons";
import { useToast } from "@/components/toast";
import { ContrasenaDialogo } from "@/components/cuenta/contrasena-dialogo";
import { CorreoDialogo } from "@/components/cuenta/correo-dialogo";
import { cambiarContrasena, cambiarCorreo } from "@/app/(tabs)/cuenta/acciones";

export function MisDatos({ email }: { email: string }) {
  const [abierto, setAbierto] = useState<"correo" | "contrasena" | null>(null);
  const toast = useToast();

  return (
    <>
      <button
        className="nbs crow text-left"
        onClick={() => setAbierto("correo")}
      >
        <span className="text-[17px]">✉️</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">Correo</b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            {email}
          </span>
        </span>
        {chevronDer}
      </button>
      <button
        className="nbs crow text-left"
        onClick={() => setAbierto("contrasena")}
      >
        <span className="text-[17px]">🔒</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">
            Contraseña
          </b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            •••••••••
          </span>
        </span>
        {chevronDer}
      </button>

      {abierto === "correo" && (
        <CorreoDialogo
          actual={email}
          onGuardar={cambiarCorreo}
          onCerrar={() => setAbierto(null)}
        />
      )}
      {abierto === "contrasena" && (
        <ContrasenaDialogo
          onGuardar={async (nueva) => {
            const e = await cambiarContrasena(nueva);
            if (e) return e;
            setAbierto(null);
            toast("¡Contraseña cambiada!");
            return null;
          }}
          onCerrar={() => setAbierto(null)}
        />
      )}
    </>
  );
}
