"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";
import { salir } from "@/app/(tabs)/cuenta/acciones";
import { limpiarCachesDelNavegador } from "@/lib/caches";

// Fila "Cerrar sesión" + confirmación: un toque perdido no te saca de la app.
export function CerrarSesion() {
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  async function confirmar() {
    setSaliendo(true);
    await limpiarCachesDelNavegador(); // el SW no debe conservar tus datos
    await salir(); // redirige a /login; este estado muere con la vista
  }

  return (
    <>
      <button className="nbs crow text-left" onClick={() => setAbierto(true)}>
        <span className="text-[17px]">🚪</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">
            Cerrar Sesión
          </b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            tus datos se quedan guardados
          </span>
        </span>
      </button>

      {abierto && (
        <Dialogo titulo="Cerrar sesión" onCerrar={() => setAbierto(false)}>
          <div className="nbs finput opacity-85">
            ¿Seguro que quieres salir?
          </div>
          <div className="mt-1 flex gap-2.5">
            <button className="btn sm flex-1" onClick={() => setAbierto(false)}>
              Cancelar
            </button>
            <button
              className="btn sm f-gg flex-1 disabled:opacity-60"
              disabled={saliendo}
              onClick={confirmar}
            >
              {saliendo ? "Saliendo…" : "Salir"}
            </button>
          </div>
        </Dialogo>
      )}
    </>
  );
}
