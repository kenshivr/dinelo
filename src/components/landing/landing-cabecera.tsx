"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useHidratado } from "@/lib/use-hidratado";
import { cn } from "@/lib/utils";
import { BTN, NAV } from "./contenido";
import { IconoCerrar, IconoLuna, IconoMenu, IconoSol } from "./iconos";

// Encabezado pegajoso de la landing (1.2.0): el bloque amarillo DiNelo (el
// mismo del login, enlazado a /landing) + anclas a las secciones + Entrar /
// Crear cuenta. Desde lg los enlaces van en línea; abajo se abren detrás del
// botón de menú. Va anclado: sin sombra Bloque.
const ENLACE =
  "rounded-xl px-3 py-2 text-[14px] font-extrabold text-muted-foreground hover:text-foreground";

// La landing se ve sin cuenta, así que el tema se cambia aquí (mismo
// next-themes que Conf). Antes de hidratar no se sabe el tema resuelto: el
// botón ofrece un texto neutro y el ícono de luna.
function TemaBoton() {
  const { resolvedTheme, setTheme } = useTheme();
  const hidratado = useHidratado();
  const oscuro = hidratado && resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label={
        hidratado ? `Cambiar a tema ${oscuro ? "claro" : "oscuro"}` : "Cambiar tema"
      }
      onClick={() => setTheme(oscuro ? "light" : "dark")}
      className="btn sm grid size-11 place-items-center p-0"
    >
      {oscuro ? <IconoSol /> : <IconoLuna />}
    </button>
  );
}

export function LandingCabecera() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header role="banner" className="landing-cabecera">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-[18px] py-2.5">
        <Link
          href="/landing"
          className="f-y mr-auto -rotate-2 rounded-xl border-2 px-3 py-1 text-[20px] font-black tracking-tighter shadow-[3px_3px_0_var(--sh)] lg:mr-6"
        >
          DiNelo
        </Link>

        <nav
          aria-label="Secciones"
          className="mr-auto hidden items-center gap-1 lg:flex"
        >
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={ENLACE}>
              {n.texto}
            </a>
          ))}
        </nav>

        <TemaBoton />
        <Link href="/login" className={cn(BTN, "sm hidden sm:inline-flex")}>
          Entrar
        </Link>
        <Link href="/registro" className={cn(BTN, "sm f-gg")}>
          Crear cuenta
        </Link>
        <button
          type="button"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          aria-controls="menu-landing"
          onClick={() => setAbierto(!abierto)}
          className="btn sm grid size-11 place-items-center p-0 lg:hidden"
        >
          {abierto ? <IconoCerrar /> : <IconoMenu />}
        </button>
      </div>

      {/* siempre montado para animar apertura y cierre; cerrado va inerte */}
      <div
        id="menu-landing"
        className="landing-menu lg:hidden"
        data-abierto={abierto}
        aria-hidden={!abierto}
        inert={!abierto}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            aria-label="Secciones"
            className="mx-auto flex max-w-6xl flex-col gap-1 px-[18px] pb-4"
          >
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={ENLACE}
                onClick={() => setAbierto(false)}
              >
                {n.texto}
              </a>
            ))}
            <Link
              href="/login"
              className={cn(ENLACE, "sm:hidden")}
              onClick={() => setAbierto(false)}
            >
              Entrar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
