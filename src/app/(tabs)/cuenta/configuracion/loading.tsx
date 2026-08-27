import Link from "next/link";
import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar, mientras el server trae las listas
export default function Cargando() {
  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Configuración</Link>}
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            desde Cuenta
          </span>
        }
      />
      <span className="lbl">Tema</span>
      <div className="ske h-10" />
      <span className="lbl">Mis categorías</span>
      <div className="ske h-12" />
      <div className="ske h-12" />
      <span className="lbl">Mis medios</span>
      <div className="ske h-12" />
      <div className="ske h-12" />
      <span className="lbl">Mis frecuentes · alimentan el desplegable</span>
      <div className="ske h-12" />
      <div className="ske h-12" />
    </>
  );
}
