"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ApartadosSeccion } from "@/components/control/apartados-seccion";
import { MediosSeccion } from "@/components/control/medios-seccion";
import { MetasView } from "@/components/metas/metas-view";
import type { Apartado, Aporte, Categoria, Medio, Meta, Transferencia } from "@/lib/tipos";

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
  apartados: "dinero comprometido",
  metas: "ahorros con nombre",
  medios: "dónde está tu dinero",
} as const;

// El tab Control agrupa el dinero con destino: apartados (comprometido del mes),
// metas (ahorro a largo plazo) y medios (cuánto hay en cada lugar), con el
// mismo patrón de segmentado del Dash.
export function ControlView({ apartados, categorias, metas, aportes, medios, saldos, transferencias }: Props) {
  const [vista, setVista] = useState<"apartados" | "metas" | "medios">("apartados");

  return (
    <>
      <PageHeader
        title="Control"
        derecha={<span className="text-xs font-bold text-muted-foreground">{SUBTITULO[vista]}</span>}
      />

      <div className="seg">
        <button className={cn(vista === "apartados" && "on")} onClick={() => setVista("apartados")}>
          Apartados
        </button>
        <button className={cn(vista === "metas" && "on")} onClick={() => setVista("metas")}>
          Metas
        </button>
        <button className={cn(vista === "medios" && "on")} onClick={() => setVista("medios")}>
          Medios
        </button>
      </div>

      {vista === "apartados" ? (
        <ApartadosSeccion apartados={apartados} categorias={categorias} medios={medios} />
      ) : vista === "metas" ? (
        <MetasView metas={metas} aportes={aportes} medios={medios} />
      ) : (
        <MediosSeccion medios={medios} saldos={saldos} transferencias={transferencias} />
      )}
    </>
  );
}
