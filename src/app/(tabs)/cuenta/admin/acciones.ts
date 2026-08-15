"use server";

import { revalidatePath } from "next/cache";
import { borrarCuentaCompleta, conAdmin } from "@/lib/supabase/admin";

// Solo el admin borra cuentas ajenas desde el informe; la suya no (moriría el
// informe — se haría desde el dashboard de Supabase).
export async function eliminarCuentaAdmin(userId: string) {
  await conAdmin();
  if (userId === process.env.ADMIN_USER_ID) return "La cuenta admin no se elimina desde la app.";

  const e = await borrarCuentaCompleta(userId);
  if (e) return e;
  revalidatePath("/cuenta/admin");
  return null;
}
