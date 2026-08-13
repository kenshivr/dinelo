"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export async function registrar(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();
  const contrasena = String(formData.get("contrasena") ?? "");
  // el enlace del correo vuelve a ESTE origen (localhost o prod, según dónde se pidió)
  const origen = (await headers()).get("origin") ?? "https://dinelo.vercel.app";

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
    options: {
      data: { nombre }, // el trigger crear_perfil_nuevo lo lee para el profile
      emailRedirectTo: `${origen}/auth/confirm`,
    },
  });

  redirect(error ? "/registro?error=1" : "/registro?enviado=1");
}
