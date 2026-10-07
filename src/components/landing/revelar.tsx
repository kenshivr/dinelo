"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Revelado de secciones al entrar (landing 1.2.0): una sola gramática
// (opacidad + 16px → 0). El contenido es visible por defecto: el estado
// oculto se agrega por DOM solo tras montar, y nunca con reduced motion, sin
// IntersectionObserver o si la sección ya está a la vista. Así no hay salto
// de layout ni contenido invisible. Los estilos viven en landing.css.
export function Revelar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      el.getBoundingClientRect().top < window.innerHeight
    )
      return;
    el.dataset.estado = "pendiente";
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.dataset.estado = "visto";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("aparece", className)}>
      {children}
    </div>
  );
}
