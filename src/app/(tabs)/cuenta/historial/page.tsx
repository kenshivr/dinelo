import { HistorialView } from "@/components/historial/historial-view";
import { categorias, medios, movimientos, perfiles } from "@/lib/mock-data";

export default function HistorialPage() {
  const perfil = perfiles[0]; // fase 2: el usuario logueado — cada quien ve SOLO lo suyo

  return (
    <HistorialView
      movimientosIniciales={movimientos.filter((m) => m.perfilId === perfil.id)}
      categorias={categorias}
      medios={medios}
    />
  );
}
