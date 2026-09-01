"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";
import { eliminarCuenta } from "@/app/(tabs)/cuenta/acciones";
import { limpiarCachesDelNavegador } from "@/lib/caches";

// Fila "Eliminar cuenta" + diálogo de confirmación fuerte: el botón rojo solo
// se habilita al teclear ELIMINAR. La cuenta admin ve un aviso en lugar del
// formulario (también la frena el server — esto es solo la cara amable).
export function EliminarCuenta({ esAdmin }: { esAdmin: boolean }) {
  const [abierto, setAbierto] = useState(false);
  const [palabra, setPalabra] = useState("");
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cerrar() {
    setAbierto(false);
    setPalabra("");
    setError(null);
  }

  async function borrar() {
    setBorrando(true);
    await limpiarCachesDelNavegador(); // el SW no debe conservar tus datos
    const e = await eliminarCuenta();
    // si salió bien la action redirige a /login y este estado muere con la vista
    if (e) {
      setError(e);
      setBorrando(false);
    }
  }

  return (
    <>
      <button className="nbs crow text-left" onClick={() => setAbierto(true)}>
        <span className="text-[17px]">🗑️</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold text-negative">
            Eliminar cuenta
          </b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            borra tus datos y tu cuenta para siempre
          </span>
        </span>
      </button>

      {abierto && (
        <Dialogo titulo="Eliminar cuenta" onCerrar={cerrar}>
          {esAdmin ? (
            <>
              <div className="nbs finput opacity-85">
                La cuenta admin no se elimina desde la app: se hace desde el
                dashboard de Supabase.
              </div>
              <button className="btn sm" onClick={cerrar}>
                Entendido
              </button>
            </>
          ) : (
            <>
              <div className="nbs finput opacity-85">
                Se borran para siempre tus movimientos, metas, apartados,
                categorías, medios, tu foto y tu cuenta.
              </div>
              <span className="text-xs font-bold leading-relaxed text-muted-foreground">
                Esta acción no se puede deshacer. Escribe ELIMINAR para
                confirmar.
              </span>
              <input
                className="nbs finput outline-none"
                value={palabra}
                onChange={(e) => setPalabra(e.target.value)}
                placeholder="ELIMINAR"
                autoComplete="off"
                autoCapitalize="characters"
              />
              {error && (
                <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
                  {error}
                </div>
              )}
              <div className="mt-1 flex gap-2.5">
                <button className="btn sm flex-1" onClick={cerrar}>
                  Cancelar
                </button>
                <button
                  className="btn sm f-r flex-1 disabled:opacity-60"
                  disabled={palabra.trim() !== "ELIMINAR" || borrando}
                  onClick={borrar}
                >
                  {borrando ? "Borrando…" : "Eliminar"}
                </button>
              </div>
            </>
          )}
        </Dialogo>
      )}
    </>
  );
}
