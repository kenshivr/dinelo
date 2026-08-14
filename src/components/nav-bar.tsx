"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  cuenta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.5 3.4-5.4 7-5.4s6.2 1.9 7 5.4" />
    </svg>
  ),
  metas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  ),
  dash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 20v-7M12 20V5M18 20v-10" />
    </svg>
  ),
  gastos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </svg>
  ),
  ingresos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
} as const;

const tabs = [
  { href: "/cuenta", label: "Cuenta", icon: icons.cuenta },
  { href: "/metas", label: "Control", icon: icons.metas }, // la ruta se queda /metas: solo cambió el nombre del tab
  { href: "/dash", label: "Dash", icon: icons.dash },
  { href: "/gastos", label: "Gastos", icon: icons.gastos },
  { href: "/ingresos", label: "Ingresos", icon: icons.ingresos },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={active ? "ni on" : "ni"}>
            {active ? <span className="nc f-y">{tab.icon}</span> : tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
