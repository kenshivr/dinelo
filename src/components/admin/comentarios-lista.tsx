"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { basurita } from "@/components/icons";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { borrarComentarioAdmin } from "@/app/(tabs)/cuenta/admin/acciones";
import type { ComentarioInforme } from "@/components/admin/informe-view";

// Bandeja de mensajes del Informe (2026-09-04): quién, cuándo y qué escribió,
// el más nuevo arriba; 🗑 cuando ya se atendió. Cliente solo por el diálogo.

// hora de México fija: el server (Vercel, UTC) y el teléfono pintan lo mismo
const fmtCuando = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Mexico_City",
});

function etiquetaCuando(iso: string) {
  return fmtCuando.format(new Date(iso)).replaceAll(".", "");
}

export function ComentariosLista({
  comentarios,
}: {
  comentarios: ComentarioInforme[];
}) {
  const [borrando, setBorrando] = useState<ComentarioInforme | null>(null);

  return (
    <>
      {comentarios.map((c) => (
        <div key={c.id} className="nbs px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            {c.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- 32px; next/image pide config de dominio remoto
              <img src={c.avatarUrl} alt="" className="av object-cover" />
            ) : (
              <span className={cn("av", c.color)}>{c.inicial}</span>
            )}
            <span className="min-w-0 flex-1">
              <b className="block truncate text-[13.5px] font-black">
                {c.nombre}
              </b>
              <span className="block truncate text-[10.5px] font-bold text-muted-foreground">
                {c.email}
              </span>
            </span>
            <button className="mini" onClick={() => setBorrando(c)}>
              {basurita}
            </button>
          </div>
          <p className="mt-2.5 text-[13px] font-bold leading-relaxed whitespace-pre-wrap">
            {c.texto}
          </p>
          <div className="mt-1.5 text-[10.5px] font-bold text-muted-foreground">
            {etiquetaCuando(c.cuando)}
          </div>
        </div>
      ))}

      {borrando && (
        <ConfirmarBorrado
          titulo="¿Borrar este mensaje?"
          resumen={`${borrando.nombre} · ${borrando.texto.slice(0, 80)}${borrando.texto.length > 80 ? "…" : ""}`}
          onBorrar={async () => {
            const e = await borrarComentarioAdmin(borrando.id);
            if (e) return e;
            setBorrando(null);
          }}
          onCerrar={() => setBorrando(null)}
        />
      )}
    </>
  );
}
