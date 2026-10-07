import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  // "grande": el bloque amarillo de las pantallas de entrada, legales y
  // offline. "chico": el texto del encabezado de las tabs.
  tamano?: "grande" | "chico";
  className?: string;
};

// El logo de la app lleva SIEMPRE a la landing (landing 1.2.0): desde dentro
// de la app /landing es pública y no rebota a /gastos.
export function Logo({ tamano = "grande", className }: Props) {
  return (
    <Link
      href="/landing"
      className={cn(
        tamano === "grande"
          ? "f-y -rotate-2 rounded-2xl border-2 px-6 py-3 text-[32px] font-black tracking-tighter shadow-[5px_5px_0_var(--sh)]"
          : "text-[21px] font-black tracking-tighter",
        className,
      )}
    >
      DiNelo
    </Link>
  );
}
