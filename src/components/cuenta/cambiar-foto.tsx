"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/toast";
import { subirAvatar } from "@/app/(tabs)/cuenta/acciones";

// 256px cuadrado con recorte centrado: de una foto de cámara (varios MB)
// sale un jpeg de ~15 KB — el free tier de Storage ni se entera.
async function redimensionar(archivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const lado = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  canvas
    .getContext("2d")!
    .drawImage(bitmap, (bitmap.width - lado) / 2, (bitmap.height - lado) / 2, lado, lado, 0, 0, 256, 256);
  return new Promise((resolver, rechazar) =>
    canvas.toBlob((b) => (b ? resolver(b) : rechazar(new Error("canvas vacío"))), "image/jpeg", 0.85),
  );
}

export function CambiarFoto() {
  const input = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const toast = useToast();

  async function subir(archivo: File) {
    setSubiendo(true);
    try {
      const blob = await redimensionar(archivo);
      const datos = new FormData();
      datos.append("archivo", blob, "avatar.jpg");
      const e = await subirAvatar(datos);
      if (e) throw new Error(e);
      toast("¡Foto actualizada!");
    } catch (err) {
      console.error("No se pudo subir el avatar:", err);
      toast("No se pudo subir la foto. Intenta de nuevo.", "error");
    }
    setSubiendo(false);
  }

  return (
    <>
      <button
        className="rounded-lg border-2 bg-card px-[11px] py-[7px] text-[11px] font-extrabold shadow-[2px_2px_0_var(--sh)] disabled:opacity-60"
        disabled={subiendo}
        onClick={() => input.current?.click()}
      >
        {subiendo ? "Subiendo…" : "📷 Cambiar foto"}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          if (archivo) subir(archivo);
          e.target.value = ""; // permite volver a elegir el mismo archivo
        }}
      />
    </>
  );
}
