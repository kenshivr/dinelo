import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar a la tab, mientras el server trae los datos
export default function Cargando() {
  return (
    <>
      <PageHeader title="Registrar Ingreso" conFecha />
      <div className="ske h-11" />
      <div className="ske mx-auto mt-1 h-16 w-40" />
      <span className="lbl">¿A dónde entra?</span>
      <div className="flex flex-wrap gap-2">
        <span className="ske h-9 w-24 rounded-full" />
        <span className="ske h-9 w-20 rounded-full" />
        <span className="ske h-9 w-28 rounded-full" />
      </div>
    </>
  );
}
