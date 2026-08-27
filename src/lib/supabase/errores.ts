import type { AuthError } from "@supabase/supabase-js";

// Traduce los errores de Supabase Auth a un mensaje de pantalla y deja el
// código real en el log del servidor (Vercel) — antes se tragaba y el usuario
// veía "intenta de nuevo" para todo. Un solo lugar: cambiar un texto aquí
// cambia registro, login, recuperar y restablecer.
const porCodigo: Record<string, string> = {
  user_already_exists: "Ya hay una cuenta con este correo.",
  email_exists: "Ya hay una cuenta con este correo.",
  // el mínimo lo valida el form; esto solo salta si el dashboard pide más
  weak_password: "La contraseña necesita más caracteres.",
  validation_failed: "Ese correo no se ve bien. Revísalo.",
  email_address_invalid: "Ese correo no se ve bien. Revísalo.",
  signup_disabled: "Por ahora no estamos abriendo cuentas nuevas.",
  invalid_credentials: "Correo o contraseña incorrectos.",
  email_not_confirmed:
    "Tu cuenta aún no está confirmada. Revisa tu correo y spam.",
  user_banned: "Esta cuenta está suspendida.",
  // 429 al mandar correo = el anterior SÍ salió (el error que vio Sam)
  over_email_send_rate_limit:
    "Ya te mandamos un enlace hace poco. Espera un minuto y revisa spam.",
  over_request_rate_limit: "Demasiados intentos. Espera un minuto.",
  request_timeout: "El servidor tardó de más. Intenta de nuevo.",
  otp_expired: "El enlace expiró o ya se usó. Pide otro.",
  same_password: "La nueva contraseña es igual a la anterior.",
  session_expired: "Tu sesión venció. Entra de nuevo.",
  session_not_found: "Tu sesión venció. Entra de nuevo.",
};

export function mensajeDeAuth(error: AuthError, donde: string): string {
  console.error(
    `[auth:${donde}]`,
    error.code ?? "sin-codigo",
    error.status ?? 0,
    error.message,
  );
  if (error.code && porCodigo[error.code]) return porCodigo[error.code];

  // sin código: decidir por el status (0 = la red ni llegó a Supabase)
  const status = error.status ?? 0;
  if (status === 0) return "Sin conexión. Revisa tu internet.";
  if (status === 429) return "Demasiados intentos. Espera un minuto.";
  if (status >= 500) return "Algo falló de nuestro lado. Intenta de nuevo.";
  return "No se pudo completar. Intenta de nuevo.";
}

export function esCuentaExistente(error: AuthError) {
  return error.code === "user_already_exists" || error.code === "email_exists";
}
