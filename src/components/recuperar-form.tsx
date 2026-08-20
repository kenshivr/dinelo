"use client";

import { useState } from "react";
import { mandarRecuperacion } from "@/app/recuperar/acciones";

export function RecuperarForm({ correoInicial }: { correoInicial?: string }) {
  const [correo, setCorreo] = useState(correoInicial ?? "");
  const [mandando, setMandando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function mandar(e: React.FormEvent) {
    e.preventDefault();
    if (mandando) return;
    // el botón se apaga en este mismo render: un solo request aunque toquen dos veces
    setMandando(true);
    setError(null);
    const mensaje = await mandarRecuperacion(correo);
    if (mensaje) {
      setError(mensaje);
      setMandando(false);
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="nbs flex flex-col items-center gap-2 px-4 py-9 text-center">
        <span className="text-[42px]">💌</span>
        <b className="text-[15px] font-black">Revisa tu correo</b>
        <span className="text-xs font-bold leading-relaxed text-muted-foreground">
          Si la dirección existe, te mandamos un enlace para restablecer tu contraseña. Si no lo
          ves, busca en spam o promociones. Ábrelo en este mismo teléfono y vuelves directo a la
          app.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={mandar} className="flex flex-col gap-3">
      <span className="lbl">Correo</span>
      <input
        className="nbs finput outline-none"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        placeholder="tu@correo.com"
        required
      />

      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}

      <button type="submit" className="btn f-y mt-2.5 disabled:opacity-60" disabled={mandando}>
        {mandando ? "Mandando…" : "Mandar enlace"}
      </button>
    </form>
  );
}
