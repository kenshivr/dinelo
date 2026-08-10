import { ConfView } from "@/components/conf/conf-view";
import { categorias, frecuentes, medios } from "@/lib/mock-data";

export default function ConfPage() {
  return (
    <ConfView
      categoriasIniciales={categorias}
      mediosIniciales={medios}
      frecuentesIniciales={frecuentes}
    />
  );
}
