"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";

export async function salir() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
