# Changelog

Todos los cambios notables de DiNelo se documentan aquí. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones,
[Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

## [1.2.0] - 2026-10-07

### Añadido

- **Landing pública** en `/landing`: qué es la app, cómo funciona, una demo de
  "Registrar gasto" con mini Dash, las funciones (Apartados, Metas, Historial,
  tema claro u oscuro), capturas reales, pasos para instalarla en iPhone y
  Android, preguntas frecuentes y pie con las páginas públicas y las redes.
  Sin sesión, `/` la sirve directo (reescritura, sin redirect); con sesión `/`
  sigue yendo a `/gastos`. Lleva título y `og:image` propios, JSON-LD
  (`SoftwareApplication` gratis + `FAQPage`) y entra al sitemap.
- `lib/rutas.ts`: la puerta del proxy (qué es público y a dónde va cada ruta
  sin sesión) como funciones puras con pruebas.
- `llms.txt` describe la landing, las páginas públicas y las redes.
- Landing: botón para cambiar entre tema claro y oscuro en la cabecera, para
  verla sin cuenta en los dos temas.

### Cambiado

- Redes oficiales de la app: Instagram @dineloapp, TikTok @dinelo979 y correo
  dineloapp@gmail.com. Privacidad y Términos ya escriben a ese correo.
- Capturas de la app en `public/landing/` (webp) para la landing.

## [1.1.1] - 2026-09-06

### Cambiado

- Dash: **Restante** pasa a llamarse **Saldo** y es la suma de todos los
  ingresos menos la de todos los gastos, sin importar el mes que se esté
  viendo. Antes se cortaba al cierre del mes visible y sumaba el saldo inicial
  de los medios. **Libre** sigue siendo Saldo menos apartados pendientes.

### Seguridad

- Dependencias: `qs` sube a 6.16.0 y `browserslist` a 4.28.7 o superior, las
  tres alertas de Dependabot. Como `@serwist/turbopack` fija browserslist en
  4.28.6, la versión se levanta con un override en `pnpm-workspace.yaml`.

## [1.1.0] - 2026-09-04

### Añadido

- Cuenta: fila **"Escríbele al creador de la app"**. El mensaje se guarda y le
  llega al creador por correo al instante; el Informe muestra la bandeja de
  comentarios con nombre, correo, texto y fecha, y permite borrarlos.
- Configuración: botón **Ordenar** en categorías, medios y frecuentes. El orden
  elegido se respeta en toda la app (chips, diálogos, desplegables, Historial
  y Control › Medios).
- Los chips de categoría llevan el **color de su categoría** (borde, letra y
  sombra) en Gastos, editar movimiento, pagar apartado y apartados; el elegido
  se rellena con ese color.
- El **emoji del frecuente** acompaña al concepto en el campo de captura.
- Páginas legales `/privacidad` y `/terminos`, enlazadas desde el registro y
  el inicio de sesión.
- Vercel Web Analytics (anónimo) y metadatos completos para compartir la app.

### Cambiado

- Dash: **Restante** y **Libre** se calculan sobre todo el historial (el saldo
  real de hoy); Ingresos y Gastos siguen siendo del mes. El Restante ya no
  muestra el neto del mes.
- Control entra por **Medios**, con el orden Medios · Apartados · Metas.
- Los conceptos de gastos e ingresos se guardan con **cada palabra en
  mayúscula**.
- Etiquetas de la interfaz en Title Case; mejoras en el selector de emoji, el
  informe, el perfil y el layout (el dock ya no se hunde al recargar y el
  segmentado de Control ya no se aplasta).

### Corregido

- Fecha de publicación de los metadatos con el offset de Ciudad de México.

### Seguridad

- Cabeceras de seguridad (X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy) y sin X-Powered-By; validación del avatar (JPEG de hasta
  1 MB); limpieza de caché al cerrar sesión o borrar la cuenta; la policy del
  bucket de avatares solo permite el archivo propio.

### Base de datos

- Columna `orden` en `categorias`, `medios` y `frecuentes`; tabla nueva
  `comentarios`. Ya aplicadas en producción; `supabase/seed.sql` refleja el
  esquema completo.

## [1.0.0] - 2026-08-27

Primera versión estable: registro de gastos e ingresos, Dash, Control
(apartados, metas y medios con saldo), Historial con búsqueda y filtros,
Configuración, cuenta con foto, PWA instalable y offline, e informe de admin.

[Unreleased]: https://github.com/kenshivr/dinelo/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/kenshivr/dinelo/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/kenshivr/dinelo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kenshivr/dinelo/releases/tag/v1.0.0
