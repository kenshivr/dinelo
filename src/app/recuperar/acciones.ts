"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export async function mandarRecuperacion(formData: FormData) {
  const correo = String(formData.get("correo") ?? "").trim();
  // el enlace del correo vuelve a ESTE origen (localhost o prod, según dónde se pidió)
  const origen = (await headers()).get("origin") ?? "https://dinelo.vercel.app";

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.resetPasswordForEmail(correo, {
    redirectTo: `${origen}/auth/confirm`,
  });

  redirect(error ? "/recuperar?error=1" : "/recuperar?enviado=1");
}
