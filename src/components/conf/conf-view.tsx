"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useHidratado } from "@/lib/use-hidratado";
import { basurita, lapiz } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { CategoriaDialogo } from "@/components/conf/categoria-dialogo";
import { MedioDialogo } from "@/components/conf/medio-dialogo";
import { FrecuenteDialogo } from "@/components/conf/frecuente-dialogo";
import type { Categoria, Frecuente, Medio } from "@/lib/mock-data";

type Props = {
  categoriasIniciales: Categoria[];
  mediosIniciales: Medio[];
  frecuentesIniciales: Frecuente[];
};

type Borrando = {
  titulo: string;
  id: string;
  nombre: string;
  coleccion: "categorias" | "medios" | "frecuentes";
};

export function ConfView({ categoriasIniciales, mediosIniciales, frecuentesIniciales }: Props) {
  const { theme, setTheme } = useTheme();
  const hidratado = useHidratado();

  // fase 2: los cambios van a Supabase; por ahora viven en memoria local
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [medios, setMedios] = useState(mediosIniciales);
  const [frecuentes, setFrecuentes] = useState(frecuentesIniciales);

  const [catDialogo, setCatDialogo] = useState<Categoria | "nueva" | null>(null);
  const [medioDialogo, setMedioDialogo] = useState<Medio | "nuevo" | null>(null);
  const [frecDialogo, setFrecDialogo] = useState<Frecuente | "nuevo" | null>(null);
  const [borrando, setBorrando] = useState<Borrando | null>(null);

  function borrar() {
    if (!borrando) return;
    if (borrando.coleccion === "categorias") setCategorias(categorias.filter((c) => c.id !== borrando.id));
    if (borrando.coleccion === "medios") setMedios(medios.filter((m) => m.id !== borrando.id));
    if (borrando.coleccion === "frecuentes") setFrecuentes(frecuentes.filter((f) => f.id !== borrando.id));
    setBorrando(null);
  }

  return (
    <>
      <PageHeader
        sinAvatar
        title="Configuración"
        derecha={<span className="text-xs font-bold text-muted-foreground">categorías compartidas</span>}
      />

      <section className="flex flex-col gap-2.5">
        <span className="lbl">Tema</span>
        <div className="seg">
          {(
            [
              ["light", "Claro"],
              ["dark", "Oscuro"],
              ["system", "Sistema"],
            ] as const
          ).map(([valor, label]) => (
            <button
              key={valor}
              className={cn(hidratado && theme === valor && "on")}
              onClick={() => setTheme(valor)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <span className="lbl flex items-center justify-between">
          Categorías · compartidas
          <BotonMas onClick={() => setCatDialogo("nueva")} />
        </span>
        {categorias.map((c) => (
          <div key={c.id} className="nbs crow">
            <span className={cn("tag", c.color)} />
            <b className="min-w-0 flex-1 truncate text-[13px] font-extrabold">{c.nombre}</b>
            <button className="mini" onClick={() => setCatDialogo(c)}>
              {lapiz}
            </button>
            <button
              className="mini"
              onClick={() =>
                setBorrando({ titulo: "¿Borrar esta categoría?", id: c.id, nombre: c.nombre, coleccion: "categorias" })
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
              <b className="block truncate text-[13px] font-extrabold">{m.nombre}</b>
              {m.tipo && <span className="text-[10.5px] font-bold text-muted-foreground">{m.tipo}</span>}
            </span>
            <button className="mini" onClick={() => setMedioDialogo(m)}>
              {lapiz}
            </button>
            <button
              className="mini"
              onClick={() =>
                setBorrando({ titulo: "¿Borrar este medio?", id: m.id, nombre: m.nombre, coleccion: "medios" })
              }
            >
              {basurita}
            </button>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2.5">
        <span className="lbl flex items-center justify-between">
          Frecuentes · alimentan el desplegable
          <BotonMas onClick={() => setFrecDialogo("nuevo")} />
        </span>
        {frecuentes.map((f) => (
          <div key={f.id} className="nbs crow">
            <span className={cn("tag", f.tipo === "G" ? "f-y" : "f-gg")}>{f.tipo}</span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-[13px] font-extrabold">{f.nombre}</b>
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
                setBorrando({ titulo: "¿Borrar este frecuente?", id: f.id, nombre: f.nombre, coleccion: "frecuentes" })
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
          onGuardar={(cat) => {
            setCategorias(
              catDialogo === "nueva" ? [...categorias, cat] : categorias.map((c) => (c.id === cat.id ? cat : c)),
            );
            setCatDialogo(null);
          }}
          onCerrar={() => setCatDialogo(null)}
        />
      )}

      {medioDialogo && (
        <MedioDialogo
          key={medioDialogo === "nuevo" ? "nuevo" : medioDialogo.id}
          medio={medioDialogo === "nuevo" ? null : medioDialogo}
          onGuardar={(medio) => {
            setMedios(
              medioDialogo === "nuevo" ? [...medios, medio] : medios.map((m) => (m.id === medio.id ? medio : m)),
            );
            setMedioDialogo(null);
          }}
          onCerrar={() => setMedioDialogo(null)}
        />
      )}

      {frecDialogo && (
        <FrecuenteDialogo
          key={frecDialogo === "nuevo" ? "nuevo" : frecDialogo.id}
          frecuente={frecDialogo === "nuevo" ? null : frecDialogo}
          onGuardar={(frec) => {
            setFrecuentes(
              frecDialogo === "nuevo" ? [...frecuentes, frec] : frecuentes.map((f) => (f.id === frec.id ? frec : f)),
            );
            setFrecDialogo(null);
          }}
          onCerrar={() => setFrecDialogo(null)}
        />
      )}

      {borrando && (
        <ConfirmarBorrado
          titulo={borrando.titulo}
          resumen={borrando.nombre}
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
      className="rounded-lg border-2 bg-card px-2.5 py-[3px] text-[11px] font-extrabold shadow-[2px_2px_0_var(--sh)]"
      onClick={onClick}
    >
      ＋
    </button>
  );
}
