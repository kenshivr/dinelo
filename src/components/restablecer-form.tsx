"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restablecer } from "@/app/restablecer/acciones";

export function RestablecerForm() {
  const router = useRouter();
  const [nueva, setNueva] = useState("");
  const [repetida, setRepetida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = nueva.length >= 6 && nueva === repetida;

  async function guardar() {
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
      <span className="lbl">Nueva contraseña</span>
      <input
        className="nbs finput outline-none"
        type="password"
        value={nueva}
        onChange={(e) => setNueva(e.target.value)}
        placeholder="mínimo 6 caracteres"
        autoComplete="new-password"
      />

      <span className="lbl">Repetila</span>
      <input
        className="nbs finput outline-none"
        type="password"
        value={repetida}
        onChange={(e) => setRepetida(e.target.value)}
        placeholder="otra vez, para confirmar"
        autoComplete="new-password"
      />
      {repetida !== "" && nueva !== repetida && (
        <span className="text-xs font-bold text-negative">Todavía no coinciden</span>
      )}

      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}

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
