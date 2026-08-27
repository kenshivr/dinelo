# ADR 0005 — Captura sin fricción: opcionales y bajas que no bloquean

- **Fecha**: 2026-08-14 (categoría opcional) / 2026-08-20 (medio opcional, regla única de bajas)
- **Estado**: Aceptada

## Contexto

La prioridad número uno del producto es capturar un gasto en segundos, con una mano.
Cada campo obligatorio y cada "no se pudo" es fricción que hace que el gasto no se
anote — y un registro incompleto vale más que un registro que no existe.

Dos puntos concretos de fricción:

1. Exigir categoría y medio de pago en cada captura.
2. Los `on delete restrict` de la base: borrar una categoría o un medio en uso
   explotaba en un error incomprensible para el usuario.

## Decisión

- **Concepto y monto son lo único obligatorio.** Categoría y medio son opcionales en
  gastos, ingresos, pago de apartados y aportes; `null` se muestra como "Sin categoría"
  / "Sin medio" (grupo gris en el Dash, fallback en Historial).
- **Regla única de bajas: borrar nunca bloquea.** Al borrar una categoría o un medio,
  lo que lo usaba pasa a "sin"; el diálogo avisa cuántos registros se van a tocar antes
  de confirmar. El `restrict` de la base queda como red de seguridad del orden de
  borrado (importa al eliminar cuentas), no como mensaje al usuario.

## Consecuencias

- ✅ La captura mínima es dos campos y guardar. Lo demás se completa si se quiere.
- ✅ Ningún flujo de baja termina en un error críptico; el usuario decide informado.
- ✅ La regla es UNA y pareja en toda la app — sin casos especiales por vista.
- ⚠️ El Dash tiene que tratar `null` como grupo de primera clase (color propio,
  etiqueta propia) en barras, pastel e historial.
- ⚠️ "Sin categoría" acumula: quedó en el backlog un filtro dedicado en Historial
  para reclasificar en lote.
