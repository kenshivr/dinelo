"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ApartadosSeccion } from "@/components/control/apartados-seccion";
import { MetasView } from "@/components/metas/metas-view";
import type { Apartado, Aporte, Categoria, Medio, Meta } from "@/lib/tipos";

type Props = {
  apartados: Apartado[];
  categorias: Categoria[];
  metas: Meta[];
  aportes: Aporte[];
  medios: Medio[];
};

// El tab Control agrupa el dinero con destino: apartados (comprometido del
// mes) y metas (ahorro a largo plazo), con el mismo patrón de segmentado del Dash.
export function ControlView({ apartados, categorias, metas, aportes, medios }: Props) {
  const [vista, setVista] = useState<"apartados" | "metas">("apartados");

  return (
    <>
      <PageHeader
        title="Control"
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            {vista === "apartados" ? "dinero comprometido" : "ahorros con nombre"}
          </span>
        }
      />

      <div className="seg">
        <button className={cn(vista === "apartados" && "on")} onClick={() => setVista("apartados")}>
          Apartados
        </button>
        <button className={cn(vista === "metas" && "on")} onClick={() => setVista("metas")}>
          Metas
        </button>
      </div>

      {vista === "apartados" ? (
        <ApartadosSeccion apartados={apartados} categorias={categorias} medios={medios} />
      ) : (
        <MetasView metas={metas} aportes={aportes} medios={medios} />
      )}
    </>
  );
}
