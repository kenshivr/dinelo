import { DashView } from "@/components/dash/dash-view";
import { categorias, medios, movimientos, perfiles } from "@/lib/mock-data";

export default function DashPage() {
  return (
    <DashView movimientos={movimientos} categorias={categorias} medios={medios} perfiles={perfiles} />
  );
}
