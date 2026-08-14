"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fmtMonto } from "@/lib/formato";
import { Dialogo } from "@/components/dialogo";
import type { Apartado, Categoria, Medio } from "@/lib/tipos";

type Props = {
  apartado: Apartado;
  categorias: Categoria[];
  medios: Medio[];
  onPagar: (datos: { medioId: string; categoriaId: string }) => Promise<string | null>;
  onCerrar: () => void;
};

export function PagarDialogo({ apartado, categorias, medios, onPagar, onCerrar }: Props) {
  const [categoriaId, setCategoriaId] = useState<string | null>(apartado.categoriaId);
  const [medioId, setMedioId] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listo = categoriaId !== null && medioId !== null;

  async function pagar() {
    if (categoriaId === null || medioId === null) return;
    setPagando(true);
    const e = await onPagar({ medioId, categoriaId });
    if (e) {
      setError(e);
      setPagando(false);
    }
  }

  return (
    <Dialogo titulo={`Pagar ${apartado.nombre}`} onCerrar={onCerrar}>
      <div className="nbs px-3.5 py-3 text-center">
        <b className="block text-[21px] font-black tracking-tight">{fmtMonto(apartado.monto)}</b>
        <span className="text-[10.5px] font-bold text-muted-foreground">
          se registra como gasto con la fecha de hoy
        </span>
      </div>

      <span className="lbl">Categoría</span>
      {categorias.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c.id}
              className={cn("chip", categoriaId === c.id && "f-y")}
              onClick={() => setCategoriaId(c.id)}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      ) : (
        <Link href="/cuenta/configuracion" className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Todavía no hay categorías — créalas en Configuración →
        </Link>
      )}

      <span className="lbl">¿De dónde salió?</span>
      {medios.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {medios.map((m) => (
            <button
              key={m.id}
              className={cn("chip", medioId === m.id && "f-y")}
              onClick={() => setMedioId(m.id)}
            >
              {m.emoji} {m.nombre}
            </button>
          ))}
        </div>
      ) : (
        <Link href="/cuenta/configuracion" className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Todavía no hay medios — créalos en Configuración →
        </Link>
      )}

      {error && <div className="nbs f-r px-3.5 py-2.5 text-center text-xs font-extrabold">{error}</div>}

      <div className="mt-1 flex gap-2.5">
        <button className="btn sm flex-1" onClick={onCerrar}>
          Cancelar
        </button>
        <button
          className="btn sm f-gg flex-1 disabled:opacity-60"
          disabled={!listo || pagando}
          onClick={pagar}
        >
          ✓ Ya lo pagué
        </button>
      </div>
    </Dialogo>
  );
}
