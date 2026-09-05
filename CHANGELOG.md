# Changelog

Todos los cambios notables de DiNelo se documentan aquí. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones,
[Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Cambiado

- Dash: **Restante** pasa a llamarse **Saldo** y es la suma de todos los
  ingresos menos la de todos los gastos, sin importar el mes que se esté
  viendo. Antes se cortaba al cierre del mes visible y sumaba el saldo inicial
  de los medios. **Libre** sigue siendo Saldo menos apartados pendientes.

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

[Unreleased]: https://github.com/kenshivr/dinelo/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/kenshivr/dinelo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/kenshivr/dinelo/releases/tag/v1.0.0
