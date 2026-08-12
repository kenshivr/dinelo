import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { crearClienteServidor } from "@/lib/supabase/servidor";

// Destino de los enlaces de correo (template con token_hash): verifica el OTP,
// deja la sesión en cookies y manda a la pantalla que toque. token_hash NO debe
// sobrevivir en la URL final.
export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams;
  const tokenHash = parametros.get("token_hash");
  const tipo = parametros.get("type") as EmailOtpType | null;

  const url = request.nextUrl.clone();
  url.searchParams.delete("token_hash");
  url.searchParams.delete("type");

  if (tokenHash && tipo) {
    const supabase = await crearClienteServidor();
    const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash });
    if (!error) {
      url.pathname = tipo === "recovery" ? "/restablecer" : "/gastos";
      return NextResponse.redirect(url);
    }
  }

  url.pathname = "/login";
  url.searchParams.set("error", "enlace");
  return NextResponse.redirect(url);
}
