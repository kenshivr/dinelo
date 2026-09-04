"use client";

import { useState } from "react";
import { Dialogo } from "@/components/dialogo";
import { useToast } from "@/components/toast";
import { cambiarNombre } from "@/app/(tabs)/cuenta/acciones";

export function CambiarNombre({ actual }: { actual: string }) {
  const [abierto, setAbierto] = useState(false);
  const [nuevo, setNuevo] = useState(actual);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const listo = nuevo.trim() !== "" && nuevo.trim() !== actual;

  function abrir() {
    setNuevo(actual);
    setError(null);
    setAbierto(true);
  }

  async function guardar() {
    setGuardando(true);
    const e = await cambiarNombre(nuevo.trim());
    if (e) {
      setError(e);
      setGuardando(false);
      return;
    }
    setGuardando(false);
    setAbierto(false);
    toast("¡Nombre cambiado!");
  }

  return (
    <>
      <button
        className="rounded-lg border-2 bg-card px-[11px] py-[7px] text-[11px] font-extrabold shadow-[2px_2px_0_var(--sh)]"
        onClick={abrir}
      >
        ✏️ Cambiar Nombre
      </button>

      {abierto && (
        <Dialogo titulo="Cambiar nombre" onCerrar={() => setAbierto(false)}>
          <span className="lbl">Tu nombre</span>
          <input
            className="nbs finput outline-none"
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            autoComplete="name"
            placeholder="¿Cómo te llamas?"
          />

          {error && (
            <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
              {error}
            </div>
          )}

          <div className="mt-1 flex gap-2.5">
            <button className="btn sm flex-1" onClick={() => setAbierto(false)}>
              Cancelar
            </button>
            <button
              className="btn sm f-gg flex-1 disabled:opacity-60"
              disabled={!listo || guardando}
              onClick={guardar}
            >
              Guardar
            </button>
          </div>
        </Dialogo>
      )}
    </>
  );
}
