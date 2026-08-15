"use client";

import { useState } from "react";
import { basurita } from "@/components/icons";
import { ConfirmarBorrado } from "@/components/confirmar-borrado";
import { eliminarCuentaAdmin } from "@/app/(tabs)/cuenta/admin/acciones";

// Botón 🗑 de cada fila del informe: borra la cuenta COMPLETA (datos, foto y
// Auth) tras confirmar. La fila del admin no lo muestra (y el server lo frena).
export function EliminarCuentaAdmin({ id, nombre, email }: { id: string; nombre: string; email: string }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button className="mini" onClick={() => setAbierto(true)}>
        {basurita}
      </button>

      {abierto && (
        <ConfirmarBorrado
          titulo="¿Eliminar esta cuenta?"
          resumen={`${nombre} · ${email} — se borran TODOS sus datos, su foto y su cuenta`}
          onBorrar={async () => {
            const e = await eliminarCuentaAdmin(id);
            if (e) return e;
            setAbierto(false);
          }}
          onCerrar={() => setAbierto(false)}
        />
      )}
    </>
  );
}
