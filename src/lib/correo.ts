import nodemailer from "nodemailer";

// Aviso por correo al admin cuando alguien le escribe desde Cuenta (2026-09-04).
// Gmail + contraseña de aplicación, la misma idea que el SMTP de Supabase.
// SERVER-ONLY (lee env vars sin NEXT_PUBLIC). Sin las env vars no manda nada y
// NO es error: el mensaje ya quedó en la base y en el Informe; el correo es el
// aviso extra. Tampoco puede tumbar la action: cualquier fallo se registra y ya.
export async function avisarComentario(datos: {
  nombre: string;
  correo: string;
  texto: string;
}) {
  const usuario = process.env.CORREO_USUARIO;
  const password = process.env.CORREO_PASSWORD;
  if (!usuario || !password) return false;

  const transporte = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: usuario, pass: password },
    // la action no puede quedarse colgada esperando a Gmail
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });

  try {
    await transporte.sendMail({
      from: `"DiNelo" <${usuario}>`,
      to: process.env.CORREO_DESTINO || usuario,
      replyTo: datos.correo || undefined, // "Responder" le contesta directo a quien escribió
      subject: `DiNelo · mensaje de ${datos.nombre}`,
      text: `${datos.nombre} (${datos.correo || "sin correo"}) escribió desde la app:\n\n${datos.texto}\n\n— También lo ves en Cuenta → Informe → Comentarios.`,
    });
    return true;
  } catch (e) {
    console.error("No se pudo mandar el aviso del comentario:", e);
    return false;
  }
}
