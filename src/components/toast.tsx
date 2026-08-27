"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type TipoToast = "exito" | "error";
type Toast = { id: number; mensaje: string; tipo: TipoToast };

const ToastContext = createContext<(mensaje: string, tipo?: TipoToast) => void>(
  () => {},
);

// const toast = useToast(); toast("¡Gasto registrado!"); toast("Falta el monto", "error");
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const siguienteId = useRef(1);

  const avisar = useCallback((mensaje: string, tipo: TipoToast = "exito") => {
    const id = siguienteId.current++;
    setToasts((lista) => [...lista, { id, mensaje, tipo }]);
    setTimeout(
      () => setToasts((lista) => lista.filter((t) => t.id !== id)),
      3000,
    );
  }, []);

  return (
    <ToastContext.Provider value={avisar}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+10px)] z-60 mx-auto flex w-full max-w-md flex-col gap-2 px-[18px]">
        {toasts.map((t) => (
          <button
            key={t.id}
            className={cn(
              "toast pointer-events-auto",
              t.tipo === "exito" ? "f-gg" : "f-r",
            )}
            onClick={() =>
              setToasts((lista) => lista.filter((x) => x.id !== t.id))
            }
          >
            {t.mensaje}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
