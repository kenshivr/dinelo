import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar a la tab, mientras el server trae las listas
export default function Cargando() {
  return (
    <>
      <PageHeader
        title="Configuración"
        derecha={<span className="text-xs font-bold text-muted-foreground">categorías compartidas</span>}
      />
      <span className="lbl">Tema</span>
      <div className="ske h-10" />
      <span className="lbl">Categorías · compartidas</span>
      <div className="ske h-12" />
      <div className="ske h-12" />
      <span className="lbl">Mis medios</span>
      <div className="ske h-12" />
      <div className="ske h-12" />
      <span className="lbl">Frecuentes · alimentan el desplegable</span>
      <div className="ske h-12" />
      <div className="ske h-12" />
    </>
  );
}
