"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ApartadosSeccion } from "@/components/control/apartados-seccion";
import { MediosSeccion } from "@/components/control/medios-seccion";
import { MetasView } from "@/components/metas/metas-view";
import type {
  Apartado,
  Aporte,
  Categoria,
  Medio,
  Meta,
  Transferencia,
} from "@/lib/tipos";

type Props = {
  apartados: Apartado[];
  categorias: Categoria[];
  metas: Meta[];
  aportes: Aporte[];
  medios: Medio[];
  saldos: Record<string, number>;
  transferencias: Transferencia[];
};

const SUBTITULO = {
  medios: "Dónde Está Tu Dinero",
  apartados: "Dinero Comprometido",
  metas: "Ahorros con Nombre",
} as const;

// El tab Control agrupa el dinero con destino: medios (cuánto hay en cada lugar),
// apartados (comprometido del mes) y metas (ahorro a largo plazo), con el
// mismo patrón de segmentado del Dash. Orden y entrada por Medios: pedido de
// Brayan (2026-09-04). Cada medio arranca de su saldo inicial; el Saldo del
// Dash, en cambio, es solo ingresos − gastos (2026-09-05).
export function ControlView({
  apartados,
  categorias,
  metas,
  aportes,
  medios,
  saldos,
  transferencias,
}: Props) {
  const [vista, setVista] = useState<"medios" | "apartados" | "metas">(
    "medios",
  );

  return (
    <>
      <PageHeader
        title="Control"
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            {SUBTITULO[vista]}
          </span>
        }
      />

      <div className="seg">
        <button
          className={cn(vista === "medios" && "on")}
          onClick={() => setVista("medios")}
        >
          Medios
        </button>
        <button
          className={cn(vista === "apartados" && "on")}
          onClick={() => setVista("apartados")}
        >
          Apartados
        </button>
        <button
          className={cn(vista === "metas" && "on")}
          onClick={() => setVista("metas")}
        >
          Metas
        </button>
      </div>

      {vista === "medios" ? (
        <MediosSeccion
          medios={medios}
          saldos={saldos}
          transferencias={transferencias}
        />
      ) : vista === "apartados" ? (
        <ApartadosSeccion
          apartados={apartados}
          categorias={categorias}
          medios={medios}
        />
      ) : (
        <MetasView metas={metas} aportes={aportes} medios={medios} />
      )}
    </>
  );
}
