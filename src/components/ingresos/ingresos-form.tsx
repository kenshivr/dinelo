"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ConceptoCombobox } from "@/components/captura/concepto-combobox";
import { MontoInput } from "@/components/captura/monto-input";
import { MedioDialogo } from "@/components/conf/medio-dialogo";
import { useToast } from "@/components/toast";
import { crearMedio, registrarIngreso } from "@/app/(tabs)/ingresos/acciones";
import { fechaLocal } from "@/lib/fechas";
import { enumerar } from "@/lib/texto";
import type { Frecuente, Medio } from "@/lib/tipos";

type Props = {
  medios: Medio[];
  frecuentes: Frecuente[];
};

export function IngresosForm({ medios, frecuentes }: Props) {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [medioId, setMedioId] = useState<string | null>(null);
  const [nuevoMedio, setNuevoMedio] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  // borde rojo por campo obligatorio; se limpia en cuanto el campo cambia
  const [errores, setErrores] = useState({ concepto: false, monto: false });
  const conceptoRef = useRef<HTMLInputElement>(null);
  const montoRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function registrar() {
    // solo concepto y monto son obligatorios: el medio es opcional
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
    const e = await registrarIngreso({
      concepto: concepto.trim(),
      monto: Number(monto),
      medioId,
      fecha: fechaLocal(new Date()), // la fecha del teléfono, no la del server (UTC)
    });
    setRegistrando(false);
    if (e) {
      toast(e, "error");
      return;
    }
    toast("¡Ingreso registrado!");
    setConcepto("");
    setMonto("");
    setMedioId(null);
  }

  return (
    <>
      <PageHeader title="Registrar ingreso" conFecha />

      <ConceptoCombobox
        ref={conceptoRef}
        value={concepto}
        onChange={(v) => {
          setConcepto(v);
          setErrores((e) => ({ ...e, concepto: false }));
        }}
        frecuentes={frecuentes}
        tipo="I"
        placeholder="Nómina, Venta, Quincena…"
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

      <span className="lbl">¿A dónde entra? · opcional</span>
      {medios.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {medios.map((m) => (
            <button
              key={m.id}
              className={cn("chip", medioId === m.id && "f-y")}
              // tocar el elegido lo quita: vuelve a "Sin medio"
              onClick={() => setMedioId(medioId === m.id ? null : m.id)}
            >
              {m.emoji} {m.nombre}
            </button>
          ))}
          {/* size fijo (no estira con la fila): círculo de verdad, no óvalo */}
          <button className="chip grid size-10 place-items-center p-0" onClick={() => setNuevoMedio(true)}>
            ＋
          </button>
        </div>
      ) : (
        <button
          className="nbs px-3.5 py-3 text-left text-sm font-extrabold text-muted-foreground"
          onClick={() => setNuevoMedio(true)}
        >
          Todavía no hay medios — crea el primero ＋
        </button>
      )}

      {nuevoMedio && (
        <MedioDialogo
          medio={null}
          onGuardar={async (datos) => {
            const r = await crearMedio(datos);
            if (r.error) return r.error;
            setMedioId(r.id); // queda elegido; el chip llega con la revalidación
            setNuevoMedio(false);
            return null;
          }}
          onCerrar={() => setNuevoMedio(false)}
        />
      )}

      <button
        className="dock f-gg -mx-[18px] mt-auto disabled:opacity-60"
        disabled={registrando}
        onClick={registrar}
      >
        {registrando ? "Registrando…" : "Registrar ingreso"}
      </button>
    </>
  );
}
