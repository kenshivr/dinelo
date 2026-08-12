"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ConceptoCombobox } from "@/components/captura/concepto-combobox";
import { MontoInput } from "@/components/captura/monto-input";
import { useToast } from "@/components/toast";
import { registrarGasto } from "@/app/(tabs)/gastos/acciones";
import { fechaLocal } from "@/lib/fechas";
import { enumerar } from "@/lib/texto";
import type { Categoria, Frecuente, Medio } from "@/lib/tipos";

type Props = {
  categorias: Categoria[];
  medios: Medio[];
  frecuentes: Frecuente[];
};

export function GastosForm({ categorias, medios, frecuentes }: Props) {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [medioId, setMedioId] = useState<string | null>(null);
  const [medioAbierto, setMedioAbierto] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const toast = useToast();

  const medio = medios.find((m) => m.id === medioId);

  async function registrar() {
    const faltantes: string[] = [];
    if (concepto.trim() === "") faltantes.push("el concepto");
    if (!(Number(monto) > 0)) faltantes.push("el monto");
    if (categoriaId === null) faltantes.push("la categoría");
    if (medioId === null) faltantes.push("el medio");
    if (categoriaId === null || medioId === null || faltantes.length > 0) {
      toast(`${faltantes.length > 1 ? "Te faltan" : "Te falta"} ${enumerar(faltantes)} para registrar`, "error");
      return;
    }

    setRegistrando(true);
    const e = await registrarGasto({
      concepto: concepto.trim(),
      monto: Number(monto),
      categoriaId,
      medioId,
      fecha: fechaLocal(new Date()), // la fecha del teléfono, no la del server (UTC)
    });
    setRegistrando(false);
    if (e) {
      toast(e, "error");
      return;
    }
    toast("¡Gasto registrado!");
    setConcepto("");
    setMonto("");
    setCategoriaId(null);
    setMedioId(null);
  }

  return (
    <>
      <PageHeader title="Registrar gasto" conFecha />

      <ConceptoCombobox
        value={concepto}
        onChange={setConcepto}
        frecuentes={frecuentes}
        placeholder="¿En qué gastaste?"
      />

      <MontoInput value={monto} onChange={setMonto} />

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
        <Link href="/conf" className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Todavía no hay categorías — crealas en Conf →
        </Link>
      )}

      <span className="lbl">¿De dónde salió?</span>
      {medios.length > 0 ? (
        <button
          className="nbs flex items-center justify-between px-3.5 py-3 text-sm font-extrabold"
          onClick={() => setMedioAbierto(!medioAbierto)}
        >
          <span className={cn(!medio && "text-muted-foreground")}>
            {medio ? `${medio.emoji}  ${medio.nombre}` : "Elegí un medio"}
          </span>
          {chevron}
        </button>
      ) : (
        <Link href="/conf" className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Todavía no hay medios — crealos en Conf →
        </Link>
      )}

      {medioAbierto && (
        <div className="nbs p-[7px]">
          {medios.map((m) => (
            <button
              key={m.id}
              className={cn("drow", medioId === m.id && "on")}
              onClick={() => {
                setMedioId(m.id);
                setMedioAbierto(false);
              }}
            >
              {m.emoji} {m.nombre}
            </button>
          ))}
        </div>
      )}

      <button
        className="dock f-gg -mx-[18px] mt-auto disabled:opacity-60"
        disabled={registrando}
        onClick={registrar}
      >
        {registrando ? "Registrando…" : "Registrar gasto"}
      </button>
    </>
  );
}
