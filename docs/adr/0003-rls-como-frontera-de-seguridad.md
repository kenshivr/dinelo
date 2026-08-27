# ADR 0003 — RLS como frontera de seguridad, no la app

- **Fecha**: 2026-08-10
- **Estado**: Aceptada

## Contexto

DiNelo pasó de "app para dos" a "cualquiera puede crear cuenta". Cada cuenta debe ver
exclusivamente lo suyo. Confiar en que *todas* las queries de la app recuerden filtrar
por usuario es frágil: basta un `where` olvidado para filtrar datos ajenos.

## Decisión

**Row Level Security en Postgres es la única frontera de seguridad.** Toda tabla tiene
políticas que comparan `auth.uid()` con el dueño de la fila. La app consulta con la
sesión del usuario y el filtrado ocurre en la base, no en el código de la app.

Para el informe de administración (métricas de uso agregadas) existe un cliente
server-only con la secret key (`src/lib/supabase/admin.ts`): RLS sigue intacto para
el resto de la app, falla cerrado si faltan las variables de entorno, y muestra uso
(conteos, actividad) — nunca montos ajenos.

## Consecuencias

- ✅ Un `where` olvidado devuelve vacío en vez de filtrar datos de otra cuenta.
  El fallo es silencioso pero seguro.
- ✅ El README puede prometer "tus datos son tuyos" apoyado en la base, no en
  disciplina de código.
- ✅ Borrar una cuenta se apoya en la cascada de la base (con el orden correcto para
  los `restrict` — ver decisión 0005).
- ⚠️ Las políticas viven en SQL: se prueban corriendo la base, no con el typechecker.
  Por eso el esquema completo (políticas incluidas) está versionado en `seed.sql`
  (ADR 0004).
- ⚠️ Debuggear "por qué no veo datos" exige pensar en dos capas: query Y política.
