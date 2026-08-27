import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar a la tab, mientras el server trae las metas
export default function Cargando() {
  return (
    <>
      <PageHeader
        title="Metas"
        derecha={
          <span className="text-xs font-bold text-muted-foreground">
            ahorros con nombre
          </span>
        }
      />
      <div className="ske h-32" />
      <div className="ske h-32" />
      <div className="ske h-32" />
    </>
  );
}
