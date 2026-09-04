"use client";

import { useState } from "react";
import { chevronDer } from "@/components/icons";
import { Dialogo } from "@/components/dialogo";
import { useToast } from "@/components/toast";
import { enviarComentario } from "@/app/(tabs)/cuenta/acciones";
import { TOPE_COMENTARIO } from "@/lib/tipos";

// Fila de Cuenta (estilo Historial/Configuración) que abre el diálogo para
// escribirle al admin: idea, mejora o comentario sobre la app (2026-09-04).
export function ComentarioFila() {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const listo = texto.trim() !== "" && texto.length <= TOPE_COMENTARIO;

  function abrir() {
    setError(null);
    setAbierto(true);
  }

  async function enviar() {
    setEnviando(true);
    const e = await enviarComentario(texto);
    setEnviando(false);
    if (e) {
      setError(e);
      return;
    }
    setAbierto(false);
    setTexto("");
    toast("¡Enviado! Gracias por escribir.");
  }

  return (
    <>
      <button className="nbs crow text-left" onClick={abrir}>
        <span className="text-[17px]">💬</span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13px] font-extrabold">
            Escríbele al creador de la app
          </b>
          <span className="text-[10.5px] font-bold text-muted-foreground">
            ideas, mejoras o algo que no funciona
          </span>
        </span>
        {chevronDer}
      </button>

      {abierto && (
        <Dialogo
          titulo="Mensaje al creador de la app"
          onCerrar={() => setAbierto(false)}
        >
          <span className="text-xs font-bold leading-relaxed text-muted-foreground">
            Le llega directo a quien hizo DiNelo, con tu nombre y tu correo
            por si necesita responderte.
          </span>
          <textarea
            className="nbs finput min-h-32 resize-none outline-none"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={TOPE_COMENTARIO}
            placeholder="Escribe aquí…"
            autoFocus
          />
          <span className="-mt-1 text-right text-[10.5px] font-bold text-muted-foreground">
            {texto.length} / {TOPE_COMENTARIO}
          </span>

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
              disabled={!listo || enviando}
              onClick={enviar}
            >
              {enviando ? "Enviando…" : "Enviar"}
            </button>
          </div>
        </Dialogo>
      )}
    </>
  );
}
