"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { moverVecino } from "@/lib/orden";
import { useHidratado } from "@/lib/use-hidratado";
import { basurita, lapiz } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { useToast } from "@/components/toast";
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
  guardarOrden,
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

type Coleccion = "categorias" | "medios" | "frecuentes";

type Borrando = {
  titulo: string;
  id: string;
  nombre: string;
  coleccion: Coleccion;
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
  const toast = useToast();

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

  // Ordenar (2026-09-04): una sección a la vez muestra ▲/▼ en vez de ✎/🗑. Cada
  // flecha reacomoda la lista al instante (optimista) y guarda el orden completo;
  // cuando vuelve la revalidación, la lista del server ya viene igual.
  const [ordenando, setOrdenando] = useState<Coleccion | null>(null);
  const [, startTransition] = useTransition();
  const [cats, setCats] = useOptimistic(categorias);
  const [meds, setMeds] = useOptimistic(medios);
  const [frecs, setFrecs] = useOptimistic(frecuentes);

  function mover<T extends { id: string }>(
    coleccion: Coleccion,
    lista: T[],
    setLista: (nueva: T[]) => void,
    i: number,
    delta: -1 | 1,
  ) {
    const nueva = moverVecino(lista, i, delta);
    if (!nueva) return;
    startTransition(async () => {
      setLista(nueva);
      const error = await guardarOrden(
        coleccion,
        nueva.map((x) => x.id),
      );
      if (error) toast(error, "error");
    });
  }

  async function borrar() {
    if (!borrando) return null;
    const error = await ACCION_BORRAR[borrando.coleccion](borrando.id);
    if (!error) setBorrando(null);
    return error;
  }

  function encabezado(
    titulo: string,
    coleccion: Coleccion,
    onNuevo: () => void,
  ) {
    const activo = ordenando === coleccion;
    return (
      <span className="lbl flex items-center justify-between">
        {titulo}
        <span className="flex gap-1.5">
          <BotonChico
            activo={activo}
            onClick={() => setOrdenando(activo ? null : coleccion)}
          >
            {activo ? "Listo" : "Ordenar"}
          </BotonChico>
          <BotonChico onClick={onNuevo}>＋</BotonChico>
        </span>
      </span>
    );
  }

  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Configuración</Link>}
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            Desde Cuenta
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
        {encabezado("Mis categorías", "categorias", () =>
          setCatDialogo("nueva"),
        )}
        {cats.map((c, i) => (
          <div key={c.id} className="nbs crow">
            <span className={cn("tag", c.color)} />
            <b className="min-w-0 flex-1 truncate text-[13px] font-extrabold">
              {c.nombre}
            </b>
            {ordenando === "categorias" ? (
              <Flechas
                i={i}
                total={cats.length}
                onMover={(d) => mover("categorias", cats, setCats, i, d)}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2.5">
        {encabezado("Mis medios", "medios", () => setMedioDialogo("nuevo"))}
        {meds.map((m, i) => (
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
            {ordenando === "medios" ? (
              <Flechas
                i={i}
                total={meds.length}
                onMover={(d) => mover("medios", meds, setMeds, i, d)}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2.5">
        {encabezado("Mis frecuentes", "frecuentes", () =>
          setFrecDialogo("nuevo"),
        )}
        {frecs.map((f, i) => (
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
            {ordenando === "frecuentes" ? (
              <Flechas
                i={i}
                total={frecs.length}
                onMover={(d) => mover("frecuentes", frecs, setFrecs, i, d)}
              />
            ) : (
              <>
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
              </>
            )}
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

// ▲/▼ de una fila en modo Ordenar; en la orilla la flecha se apaga
function Flechas({
  i,
  total,
  onMover,
}: {
  i: number;
  total: number;
  onMover: (delta: -1 | 1) => void;
}) {
  return (
    <>
      <button
        className="mini text-[11px] disabled:opacity-40"
        aria-label="Subir"
        disabled={i === 0}
        onClick={() => onMover(-1)}
      >
        ▲
      </button>
      <button
        className="mini text-[11px] disabled:opacity-40"
        aria-label="Bajar"
        disabled={i === total - 1}
        onClick={() => onMover(1)}
      >
        ▼
      </button>
    </>
  );
}

// botón chico del encabezado de sección: ＋ y Ordenar/Listo (amarillo mientras ordena)
function BotonChico({
  activo,
  onClick,
  children,
}: {
  activo?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={cn(
        "rounded-lg border-2 bg-card px-2.5 py-[3px] text-[11px] font-extrabold shadow-[2px_2px_0_var(--sh)] transition-[translate,box-shadow] duration-75 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_var(--sh)]",
        activo && "f-y",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
