"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// UNA regla para toda la app (registro, cambiar y restablecer contraseña) —
// la misma que "Password requirements" en el dashboard de Supabase.
export const MINIMO_CONTRASENA = 8;

export function contrasenaLista(nueva: string, repetida: string) {
  return nueva.length >= MINIMO_CONTRASENA && nueva === repetida;
}

type Props = {
  nueva: string;
  repetida: string;
  onNueva: (v: string) => void;
  onRepetida: (v: string) => void;
  etiquetaNueva?: string;
  etiquetaRepetida?: string;
};

// Par "contraseña + confirmación" con ojito y pistas en vivo (mínimo y coinciden).
export function ParContrasenas({
  nueva,
  repetida,
  onNueva,
  onRepetida,
  etiquetaNueva = "Nueva contraseña",
  etiquetaRepetida = "Repítela",
}: Props) {
  const largoOk = nueva.length >= MINIMO_CONTRASENA;
  const coinciden = repetida !== "" && nueva === repetida;

  return (
    <>
      <span className="lbl">{etiquetaNueva}</span>
      <CampoContrasena
        value={nueva}
        onChange={onNueva}
        placeholder={`mínimo ${MINIMO_CONTRASENA} caracteres`}
      />
      <Pista estado={nueva === "" ? "neutro" : largoOk ? "ok" : "mal"}>
        {largoOk ? "✓" : "○"} mínimo {MINIMO_CONTRASENA} caracteres
      </Pista>

      <span className="lbl">{etiquetaRepetida}</span>
      <CampoContrasena
        value={repetida}
        onChange={onRepetida}
        placeholder="otra vez, para confirmar"
      />
      {repetida !== "" && (
        <Pista estado={coinciden ? "ok" : "mal"}>
          {coinciden ? "✓ coinciden" : "○ todavía no coinciden"}
        </Pista>
      )}
    </>
  );
}

// Campo de contraseña con ojito. Lo usan el par de arriba y el login
// (ahí con autoComplete="current-password" para que el gestor ofrezca la guardada).
export function CampoContrasena({
  value,
  onChange,
  placeholder,
  autoComplete = "new-password",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: "new-password" | "current-password";
  required?: boolean;
}) {
  const [ver, setVer] = useState(false);
  return (
    <div className="relative">
      <input
        className="nbs finput w-full pr-12 outline-none"
        type={ver ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute top-1/2 right-1.5 -translate-y-1/2 p-2 text-muted-foreground"
        onClick={() => setVer((v) => !v)}
      >
        {ver ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function Pista({
  estado,
  children,
}: {
  estado: "neutro" | "ok" | "mal";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "-mt-1 self-start rounded-full border-2 px-2.5 py-1 text-[11px] font-extrabold",
        estado === "ok" && "f-gg",
        estado === "neutro" && "border-border text-muted-foreground",
        estado === "mal" && "border-negative text-negative",
      )}
    >
      {children}
    </span>
  );
}
