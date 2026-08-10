import { GastosForm } from "@/components/gastos/gastos-form";
import { categorias, medios, frecuentes } from "@/lib/mock-data";

export default function GastosPage() {
  return (
    <GastosForm
      categorias={categorias}
      medios={medios}
      frecuentes={frecuentes.filter((f) => f.tipo === "G")}
    />
  );
}
