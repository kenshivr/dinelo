# Postmortem — "No se pudo crear la cuenta" (primer bug real de producción)

- **Fecha del incidente**: 2026-08-20
- **Impacto**: la primera tester externa no pudo registrarse ni entrar; las tres
  primeras cuentas de testers quedaron en estado inconsistente.
- **Estado**: resuelto el mismo día (fix desplegado y verificado en producción).

## Qué vio la usuaria

1. Llenó el registro y tocó "Crear cuenta" → error: **"No se pudo crear la cuenta"**.
2. Intentó iniciar sesión → error: **"correo o contraseña incorrectos"**, con la
   contraseña correcta.

Dos mensajes de error, ninguno verdadero. La cuenta **sí existía**.

## Qué pasó de verdad (cadena de causas)

1. **El botón de registro no tenía estado *pending***: se podía tocar dos veces.
2. **El correo de confirmación salía por SMTP de Gmail**, que tarda varios segundos
   en responder — ventana de sobra para el segundo toque.
3. El segundo toque disparó **un segundo `POST /signup`**, que Supabase rechazó con
   **429 (rate limit)**. Ese error fue el que ganó la pantalla: el primer request ya
   había creado la cuenta, pero la usuaria vio el fallo del segundo.
4. El correo de confirmación **cayó a spam**, así que la cuenta quedó sin confirmar.
5. Al intentar entrar, el login **mapeaba `email_not_confirmed` a "correo o contraseña
   incorrectos"** — un mensaje falso que enterró la causa real.

Un bug de UX (doble submit) + una latencia externa (SMTP) + un mensaje de error
mentiroso. Ninguno grave por separado; juntos, una usuaria bloqueada.

## Mitigación inmediata

- Las cuentas afectadas se confirmaron a mano.
- Después se decidió **borrar las tres cuentas de testers** para que recrearan su
  cuenta ya con el flujo corregido — mejor un alta limpia que tres estados raros.

## Fixes desplegados (mismo día)

- **Estados *pending* en registro, login y recuperar** ("Creando cuenta…",
  "Entrando…", "Mandando…"): el botón se deshabilita al primer toque.
- **Catálogo de errores de auth por código** (`lib/supabase/errores.ts`): cada código
  conocido tiene su mensaje honesto en español, con fallback por status HTTP y
  `console.error` del error real para diagnóstico.
- **Confirm email: OFF** (decisión de producto): para esta app, pedir confirmación de
  correo agregaba un paso frágil (spam, SMTP lento) sin beneficio proporcional.
- El correo queda **precargado entre pantallas de auth** (`?correo=`) para no
  reteclearlo tras un error.

## Lecciones

1. **Todo botón que dispara un request necesita estado pending.** No es polish, es
   correctitud: el doble submit fue la raíz de todo.
2. **Los mensajes de error se mapean por código, nunca por suposición.** Un error
   falso ("incorrectos") cuesta más que no tener mensaje: manda el diagnóstico a la
   dirección equivocada.
3. **La latencia de terceros es parte de tu UX.** El SMTP lento no era un bug, pero
   creó la ventana para el que sí lo era.
4. **El flujo de primer uso se prueba con usuarios que no son el desarrollador.**
   El autor nunca toca dos veces: ya sabe que va a tardar.
