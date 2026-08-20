"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { entrar } from "@/app/login/acciones";
import { CampoContrasena } from "@/components/captura/par-contrasenas";

type Props = {
  correoInicial?: string; // viene de "Ya hay una cuenta con este correo" en registro
  errorInicial?: string; // viene de /auth/confirm cuando el enlace ya no sirve
};

export function LoginForm({ correoInicial, errorInicial }: Props) {
  const router = useRouter();
  const [correo, setCorreo] = useState(correoInicial ?? "");
  const [contrasena, setContrasena] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [error, setError] = useState<string | null>(errorInicial ?? null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (entrando) return;
    // el botón se apaga en este mismo render: un solo request aunque toquen dos veces
    setEntrando(true);
    setError(null);
    const mensaje = await entrar({ correo, contrasena });
    if (mensaje) {
      setError(mensaje);
      setEntrando(false);
      return;
    }
    router.replace("/gastos");
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
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

      <span className="lbl">Contraseña</span>
      <CampoContrasena
        value={contrasena}
        onChange={setContrasena}
        autoComplete="current-password"
        placeholder="•••••••••"
        required
      />

      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}

      <button type="submit" className="btn f-y mt-2.5 disabled:opacity-60" disabled={entrando}>
        {entrando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
