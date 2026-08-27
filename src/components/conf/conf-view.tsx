"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useHidratado } from "@/lib/use-hidratado";
import { basurita, lapiz } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { CategoriaDialogo } from "@/components/conf/categoria-dialogo";
import { MedioDialogo } from "@/components/conf/medio-dialogo";
import { FrecuenteDialogo } from "@/components/conf/frecuente-dialogo";
import {
  borrarCategoria,
  borrarFrecuente,
  borrarMedio,
  guardarCategoria,
  guardarFrecuente,
  guardarMedio,
} from "@/app/(tabs)/cuenta/configuracion/acciones";
import type { Categoria, Frecuente, Medio } from "@/lib/tipos";

// cuántos movimientos usan cada categoría / medio, y cuántos aportes y transferencias cada medio (id → conteo)
export type Usos = {
  categorias: Record<string, number>;
  medios: Record<string, number>;
  aportes: Record<string, number>;
  transferencias: Record<string, number>;
};

type Props = {
  categorias: Categoria[];
  medios: Medio[];
  frecuentes: Frecuente[];
  usos: Usos;
};

type Borrando = {
  titulo: string;
  id: string;
  nombre: string;
  coleccion: "categorias" | "medios" | "frecuentes";
  aviso?: string;
};

// "Tiene 12 gastos y 2 aportes registrados: pasarán a Sin categoría." — nada si no tiene
function avisoDeUso(conteos: [number, string][], destino: string) {
  const partes = conteos
    .filter(([n]) => n > 0)
    .map(([n, cosa]) => `${n} ${cosa}${n === 1 ? "" : "s"}`);
  if (partes.length === 0) return undefined;
  const total = conteos.reduce((suma, [n]) => suma + n, 0);
  return total === 1
    ? `Tiene ${partes[0]} registrado: pasará a ${destino}.`
    : `Tiene ${partes.join(" y ")} registrados: pasarán a ${destino}.`;
}

const ACCION_BORRAR = {
  categorias: borrarCategoria,
  medios: borrarMedio,
  frecuentes: borrarFrecuente,
} as const;

export function ConfView({ categorias, medios, frecuentes, usos }: Props) {
  // sin opción "Sistema": quien nunca eligió ve marcado el tema que resolvió su teléfono
  const { resolvedTheme, setTheme } = useTheme();
  const hidratado = useHidratado();

  const [catDialogo, setCatDialogo] = useState<Categoria | "nueva" | null>(
    null,
  );
  const [medioDialogo, setMedioDialogo] = useState<Medio | "nuevo" | null>(
    null,
  );
  const [frecDialogo, setFrecDialogo] = useState<Frecuente | "nuevo" | null>(
    null,
  );
  const [borrando, setBorrando] = useState<Borrando | null>(null);

  async function borrar() {
    if (!borrando) return null;
    const error = await ACCION_BORRAR[borrando.coleccion](borrando.id);
    if (!error) setBorrando(null);
    return error;
  }

  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Configuración</Link>}
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            desde Cuenta
          </span>
        }
      />

      <section className="flex flex-col gap-2.5">
        <span className="lbl">Tema</span>
        <div className="seg">
          {(
            [
              ["light", "Claro"],
              ["dark", "Oscuro"],
            ] as const
          ).map(([valor, label]) => (
            <button
              key={valor}
              className={cn(hidratado && resolvedTheme === valor && "on")}
              onClick={() => setTheme(valor)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <span className="lbl flex items-center justify-between">
          Mis categorías
          <BotonMas onClick={() => setCatDialogo("nueva")} />
        </span>
        {categorias.map((c) => (
          <div key={c.id} className="nbs crow">
            <span className={cn("tag", c.color)} />
            <b className="min-w-0 flex-1 truncate text-[13px] font-extrabold">
              {c.nombre}
            </b>
            <button className="mini" onClick={() => setCatDialogo(c)}>
              {lapiz}
            </button>
            <button
              className="mini"
              onClick={() =>
                setBorrando({
                  titulo: "¿Borrar esta categoría?",
                  id: c.id,
                  nombre: c.nombre,
                  coleccion: "categorias",
                  aviso: avisoDeUso(
                    [[usos.categorias[c.id] ?? 0, "gasto"]],
                    "Sin categoría",
                  ),
                })
              }
            >
              {basurita}
            </button>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2.5">
        <span className="lbl flex items-center justify-between">
          Mis medios
          <BotonMas onClick={() => setMedioDialogo("nuevo")} />
        </span>
        {medios.map((m) => (
          <div key={m.id} className="nbs crow">
            <span className="text-[17px]">{m.emoji}</span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-[13px] font-extrabold">
                {m.nombre}
              </b>
              {m.tipo && (
                <span className="text-[10.5px] font-bold text-muted-foreground">
                  {m.tipo}
                </span>
              )}
            </span>
            <button className="mini" onClick={() => setMedioDialogo(m)}>
              {lapiz}
            </button>
            <button
              className="mini"
              onClick={() =>
                setBorrando({
                  titulo: "¿Borrar este medio?",
                  id: m.id,
                  nombre: m.nombre,
                  coleccion: "medios",
                  aviso: avisoDeUso(
                    [
                      [usos.medios[m.id] ?? 0, "movimiento"],
                      [usos.aportes[m.id] ?? 0, "aporte"],
                      [usos.transferencias[m.id] ?? 0, "transferencia"],
                    ],
                    "Sin medio",
                  ),
                })
              }
            >
              {basurita}
            </button>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2.5">
        <span className="lbl flex items-center justify-between">
          Mis frecuentes · alimentan el desplegable
          <BotonMas onClick={() => setFrecDialogo("nuevo")} />
        </span>
        {frecuentes.map((f) => (
          <div key={f.id} className="nbs crow">
            <span className={cn("tag", f.tipo === "G" ? "f-y" : "f-gg")}>
              {f.tipo}
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-[13px] font-extrabold">
                {f.nombre}
              </b>
              <span className="text-[10.5px] font-bold text-muted-foreground">
                {f.tipo === "G" ? "gasto frecuente" : "ingreso frecuente"}
              </span>
            </span>
            <button className="mini" onClick={() => setFrecDialogo(f)}>
              {lapiz}
            </button>
            <button
              className="mini"
              onClick={() =>
                setBorrando({
                  titulo: "¿Borrar este frecuente?",
                  id: f.id,
                  nombre: f.nombre,
                  coleccion: "frecuentes",
                })
              }
            >
              {basurita}
            </button>
          </div>
        ))}
      </section>

      {catDialogo && (
        <CategoriaDialogo
          key={catDialogo === "nueva" ? "nueva" : catDialogo.id}
          categoria={catDialogo === "nueva" ? null : catDialogo}
          onGuardar={async (datos) => {
            const error = await guardarCategoria(
              catDialogo === "nueva" ? datos : { ...datos, id: catDialogo.id },
            );
            if (!error) setCatDialogo(null);
            return error;
          }}
          onCerrar={() => setCatDialogo(null)}
        />
      )}

      {medioDialogo && (
        <MedioDialogo
          key={medioDialogo === "nuevo" ? "nuevo" : medioDialogo.id}
          medio={medioDialogo === "nuevo" ? null : medioDialogo}
          onGuardar={async (datos) => {
            const error = await guardarMedio(
              medioDialogo === "nuevo"
                ? datos
                : { ...datos, id: medioDialogo.id },
            );
            if (!error) setMedioDialogo(null);
            return error;
          }}
          onCerrar={() => setMedioDialogo(null)}
        />
      )}

      {frecDialogo && (
        <FrecuenteDialogo
          key={frecDialogo === "nuevo" ? "nuevo" : frecDialogo.id}
          frecuente={frecDialogo === "nuevo" ? null : frecDialogo}
          onGuardar={async (datos) => {
            const error = await guardarFrecuente(
              frecDialogo === "nuevo"
                ? datos
                : { ...datos, id: frecDialogo.id },
            );
            if (!error) setFrecDialogo(null);
            return error;
          }}
          onCerrar={() => setFrecDialogo(null)}
        />
      )}

      {borrando && (
        <ConfirmarBorrado
          titulo={borrando.titulo}
          resumen={borrando.nombre}
          aviso={borrando.aviso}
          onBorrar={borrar}
          onCerrar={() => setBorrando(null)}
        />
      )}
    </>
  );
}

function BotonMas({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="rounded-lg border-2 bg-card px-2.5 py-[3px] text-[11px] font-extrabold shadow-[2px_2px_0_var(--sh)] transition-[translate,box-shadow] duration-75 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--sh)]"
      onClick={onClick}
    >
      ＋
    </button>
  );
}
