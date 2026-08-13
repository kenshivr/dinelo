"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ConceptoCombobox } from "@/components/captura/concepto-combobox";
import { MontoInput } from "@/components/captura/monto-input";
import { useToast } from "@/components/toast";
import { registrarIngreso } from "@/app/(tabs)/ingresos/acciones";
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
  const [registrando, setRegistrando] = useState(false);
  const toast = useToast();

  async function registrar() {
    const faltantes: string[] = [];
    if (concepto.trim() === "") faltantes.push("el concepto");
    if (!(Number(monto) > 0)) faltantes.push("el monto");
    if (medioId === null) faltantes.push("el medio");
    if (medioId === null || faltantes.length > 0) {
      toast(`${faltantes.length > 1 ? "Te faltan" : "Te falta"} ${enumerar(faltantes)} para registrar`, "error");
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
        value={concepto}
        onChange={setConcepto}
        frecuentes={frecuentes}
        placeholder="¿De dónde llegó?"
      />

      <MontoInput value={monto} onChange={setMonto} />

      <span className="lbl">¿A dónde entra?</span>
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
