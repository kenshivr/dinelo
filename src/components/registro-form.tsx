"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registrar } from "@/app/registro/acciones";
import {
  ParContrasenas,
  contrasenaLista,
} from "@/components/captura/par-contrasenas";

const correoValido = (c: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.trim());

export function RegistroForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetida, setRepetida] = useState("");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<{
    mensaje: string;
    yaExiste: boolean;
  } | null>(null);
  const [enviado, setEnviado] = useState(false);

  const listo =
    nombre.trim() !== "" &&
    correoValido(correo) &&
    contrasenaLista(contrasena, repetida);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (!listo || creando) return;
    // el botón se apaga en este mismo render: un solo request aunque toquen dos veces
    setCreando(true);
    setError(null);
    const r = await registrar({ nombre, correo, contrasena });
    if (!r.ok) {
      setError(r);
      setCreando(false);
      return;
    }
    if (r.sesion) {
      router.replace("/gastos");
      return;
    }
    setEnviado(true);
  }

  // solo si "Confirm email" sigue encendido en Supabase
  if (enviado) {
    return (
      <div className="nbs flex flex-col items-center gap-2 px-4 py-9 text-center">
        <span className="text-[42px]">💌</span>
        <b className="text-[15px] font-black">Revisa tu correo</b>
        <span className="text-xs font-bold leading-relaxed text-muted-foreground">
          Te mandamos un enlace a <b>{correo}</b> para confirmar tu cuenta. Si
          no lo ves, busca en spam o promociones. Ábrelo en este mismo teléfono
          y entras directo a la app.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={crear} className="flex flex-col gap-3">
      <span className="lbl">Nombre</span>
      <input
        className="nbs finput outline-none"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        autoComplete="name"
        placeholder="¿Cómo te llamas?"
      />

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
      />
      <span className="-mt-1.5 text-[11px] font-bold text-muted-foreground">
        Usa uno real: es como recuperas tu contraseña.
      </span>

      <ParContrasenas
        nueva={contrasena}
        repetida={repetida}
        onNueva={setContrasena}
        onRepetida={setRepetida}
        etiquetaNueva="Contraseña"
        etiquetaRepetida="Confirma tu contraseña"
      />

      {error && (
        <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">
          {error.mensaje}
          {error.yaExiste && (
            <div className="mt-1.5 flex justify-center gap-4">
              <Link
                href={`/login?correo=${encodeURIComponent(correo)}`}
                className="underline"
              >
                Entrar
              </Link>
              <Link
                href={`/recuperar?correo=${encodeURIComponent(correo)}`}
                className="underline"
              >
                Recuperar contraseña
              </Link>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        className="btn f-y mt-2.5 disabled:opacity-60"
        disabled={!listo || creando}
      >
        {creando ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <span className="text-center text-[10.5px] font-bold leading-relaxed text-muted-foreground">
        Al crear tu cuenta aceptas los{" "}
        <Link href="/terminos" className="underline">
          Términos
        </Link>{" "}
        y el{" "}
        <Link href="/privacidad" className="underline">
          Aviso de privacidad
        </Link>
        .
      </span>
    </form>
  );
}
