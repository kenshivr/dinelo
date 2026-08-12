import Link from "next/link";
import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar, mientras el server trae el mes
export default function Cargando() {
  return (
    <>
      <PageHeader
        title={<Link href="/cuenta">‹ Historial</Link>}
        derecha={<span className="text-xs font-bold text-muted-foreground">desde Cuenta</span>}
      />
      <div className="flex flex-wrap gap-2">
        <span className="ske h-9 w-16 rounded-full" />
        <span className="ske h-9 w-20 rounded-full" />
        <span className="ske h-9 w-24 rounded-full" />
        <span className="ske h-9 w-28 rounded-full" />
      </div>
      <span className="lbl">Hoy</span>
      <div className="ske h-14" />
      <div className="ske h-14" />
      <div className="ske h-14" />
    </>
  );
}
