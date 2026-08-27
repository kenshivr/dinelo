# ADR 0004 — Esquema completo en un solo `seed.sql`, sin migraciones

- **Fecha**: 2026-08-21
- **Estado**: Aceptada

## Contexto

Durante el desarrollo, cada cambio de esquema fue un parche SQL corrido a mano en el
SQL Editor de Supabase. Al abrir el repo al público se acumulaban 11 parches: imposibles
de correr en orden por alguien que quiera levantar la app desde cero, y algunos con
datos reales adentro.

Las alternativas eran adoptar una herramienta de migraciones (Supabase CLI, Drizzle Kit)
o consolidar el estado final.

## Decisión

**Un solo archivo, [`supabase/seed.sql`](../../supabase/seed.sql), con el estado final
completo de la base**: las 8 tablas, índices, políticas RLS, el trigger de alta de perfil
(categorías y medios base al registrarse) y el bucket de fotos con sus permisos.
Se corre UNA vez sobre un proyecto vacío. Cambios futuros de esquema se hacen editando
este mismo archivo. Los 11 parches históricos se borraron del repo.

## Consecuencias

- ✅ Levantar la app desde cero es: proyecto vacío → pegar `seed.sql` → Run. Un paso.
- ✅ El esquema (políticas RLS incluidas) queda versionado y revisable en un solo lugar.
- ✅ Se verificó corriéndolo completo en un cluster PostgreSQL 17 limpio antes de publicarlo.
- ⚠️ No hay camino de migración para instancias existentes: el archivo es el estado
  final, no una secuencia. Con una sola instancia en producción (la propia), el costo
  real hoy es cero; los cambios se aplican a mano en prod y se reflejan en el archivo.
- ⚠️ El nombre choca con la convención de Supabase CLI (donde `seed.sql` = datos, no
  esquema). Decisión consciente: acá el nombre significa "siembra la base completa".
- 🔁 Revisar si el proyecto gana más instancias o más manos: ahí sí, migraciones.
