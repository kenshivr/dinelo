import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar a la tab, mientras el server trae el mes
export default function Cargando() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        derecha={<span className="h-4 w-24 animate-pulse rounded bg-muted" />}
      />
      <div className="grid grid-cols-2 gap-2.5">
        <div className="ske h-[68px]" />
        <div className="ske h-[68px]" />
      </div>
      <div className="ske h-10" />
      <div className="ske h-44" />
      <div className="ske h-44" />
      <div className="ske h-40" />
    </>
  );
}
