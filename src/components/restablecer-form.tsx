"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restablecer } from "@/app/restablecer/acciones";
import {
  ParContrasenas,
  contrasenaLista,
} from "@/components/captura/par-contrasenas";

export function RestablecerForm() {
  const router = useRouter();
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = contrasenaLista(nueva, repetida);

  async function guardar() {
    if (!listo || guardando) return;
    setGuardando(true);
    setError(null);
    const e = await restablecer(nueva);
    if (e) {
      setError(e);
      setGuardando(false);
      return;
    }
    router.replace("/gastos");
  }

  return (
    <div className="flex flex-col gap-3">
      <ParContrasenas
        nueva={nueva}
        repetida={repetida}
        onNueva={setNueva}
        onRepetida={setRepetida}
      />

      {error && (
        <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
          {error}
        </div>
      )}

      <button
        className="btn f-y mt-2.5 disabled:opacity-60"
        disabled={!listo || guardando}
        onClick={guardar}
      >
        {guardando ? "Guardando…" : "Guardar y entrar"}
      </button>
    </div>
  );
}
