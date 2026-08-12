import { PageHeader } from "@/components/page-header";

// Se muestra INSTANTÁNEO al entrar a la tab, mientras el server trae el perfil
export default function Cargando() {
  return (
    <>
      <PageHeader
        title="Cuenta"
        derecha={<span className="text-xs font-bold text-muted-foreground">tu perfil</span>}
      />
      <div className="ske h-[70px]" />
      <span className="lbl">Mis datos</span>
      <div className="ske h-14" />
      <div className="ske h-14" />
      <span className="lbl">Movimientos</span>
      <div className="ske h-14" />
    </>
  );
}
