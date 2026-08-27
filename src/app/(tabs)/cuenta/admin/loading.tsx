import Link from "next/link";
import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar, mientras el server arma el informe
export default function Cargando() {
  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Informe</Link>}
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            solo admin
          </span>
        }
      />
      <span className="lbl">La app hoy</span>
      <div className="grid grid-cols-2 gap-3">
        <div className="ske h-[74px]" />
        <div className="ske h-[74px]" />
        <div className="ske h-[74px]" />
        <div className="ske h-[74px]" />
      </div>
      <span className="lbl">Uso de la app</span>
      <div className="ske h-44" />
      <span className="lbl">Altas por mes</span>
      <div className="ske h-36" />
      <span className="lbl">Cuentas</span>
      <div className="ske h-24" />
      <div className="ske h-24" />
    </>
  );
}
