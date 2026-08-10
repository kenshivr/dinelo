import { IngresosForm } from "@/components/ingresos/ingresos-form";
import { medios, frecuentes } from "@/lib/mock-data";

export default function IngresosPage() {
  return <IngresosForm medios={medios} frecuentes={frecuentes.filter((f) => f.tipo === "I")} />;
}
