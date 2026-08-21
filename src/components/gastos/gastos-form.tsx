"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { chevron } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ConceptoCombobox } from "@/components/captura/concepto-combobox";
import { MontoInput } from "@/components/captura/monto-input";
import { CategoriaDialogo } from "@/components/conf/categoria-dialogo";
import { useToast } from "@/components/toast";
import { crearCategoria, registrarGasto } from "@/app/(tabs)/gastos/acciones";
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
  const [nuevaCategoria, setNuevaCategoria] = useState(false);
  const [medioId, setMedioId] = useState<string | null>(null);
  const [medioAbierto, setMedioAbierto] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  // borde rojo por campo obligatorio; se limpia en cuanto el campo cambia
  const [errores, setErrores] = useState({ concepto: false, monto: false });
  const conceptoRef = useRef<HTMLInputElement>(null);
  const montoRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const medio = medios.find((m) => m.id === medioId);

  async function registrar() {
    // solo concepto y monto son obligatorios: categoría y medio opcionales
    const errs = {
      concepto: concepto.trim() === "",
      monto: !(Number(monto) > 0),
    };
    setErrores(errs);
    if (errs.concepto || errs.monto) {
      const faltantes: string[] = [];
      if (errs.concepto) faltantes.push("el concepto");
      if (errs.monto) faltantes.push("el monto");
      toast(`${faltantes.length > 1 ? "Te faltan" : "Te falta"} ${enumerar(faltantes)} para registrar`, "error");
      // el foco también trae el campo a la vista
      if (errs.concepto) conceptoRef.current?.focus();
      else montoRef.current?.focus();
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
        ref={conceptoRef}
        value={concepto}
        onChange={(v) => {
          setConcepto(v);
          setErrores((e) => ({ ...e, concepto: false }));
        }}
        frecuentes={frecuentes}
        tipo="G"
        placeholder="Cine, Comida, Ropa…"
        error={errores.concepto}
      />

      <MontoInput
        ref={montoRef}
        value={monto}
        onChange={(v) => {
          setMonto(v);
          setErrores((e) => ({ ...e, monto: false }));
        }}
        error={errores.monto}
      />

      <span className="lbl">Categoría · opcional</span>
      {categorias.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c.id}
              className={cn("chip", categoriaId === c.id && "f-y")}
              onClick={() => setCategoriaId(categoriaId === c.id ? null : c.id)}
            >
              {c.nombre}
            </button>
          ))}
          {/* size fijo (no estira con la fila): círculo de verdad, no óvalo */}
          <button className="chip grid size-10 place-items-center p-0" onClick={() => setNuevaCategoria(true)}>
            ＋
          </button>
        </div>
      ) : (
        <button
          className="nbs px-3.5 py-3 text-left text-sm font-extrabold text-muted-foreground"
          onClick={() => setNuevaCategoria(true)}
        >
          Todavía no hay categorías — crea la primera ＋
        </button>
      )}

      {nuevaCategoria && (
        <CategoriaDialogo
          categoria={null}
          onGuardar={async (datos) => {
            const r = await crearCategoria(datos);
            if (r.error) return r.error;
            setCategoriaId(r.id); // queda elegida; el chip llega con la revalidación
            setNuevaCategoria(false);
            return null;
          }}
          onCerrar={() => setNuevaCategoria(false)}
        />
      )}

      <span className="lbl">¿De dónde salió? · opcional</span>
      {medios.length > 0 ? (
        <button
          className="nbs flex items-center justify-between px-3.5 py-3 text-sm font-extrabold"
          onClick={() => setMedioAbierto(!medioAbierto)}
        >
          <span className={cn(!medio && "text-muted-foreground")}>
            {medio ? `${medio.emoji}  ${medio.nombre}` : "Sin medio"}
          </span>
          {chevron}
        </button>
      ) : (
        <Link href="/cuenta/configuracion" className="nbs block px-3.5 py-3 text-sm font-extrabold text-muted-foreground">
          Todavía no hay medios — créalos en Configuración →
        </Link>
      )}

      {medioAbierto && (
        <div className="nbs p-[7px]">
          {medios.map((m) => (
            <button
              key={m.id}
              className={cn("drow", medioId === m.id && "on")}
              onClick={() => {
                // tocar el elegido lo quita: vuelve a "Sin medio"
                setMedioId(medioId === m.id ? null : m.id);
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
