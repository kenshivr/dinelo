# ADR 0002 — RSC + Server Actions, sin estado global ni API propia

- **Fecha**: 2026-08-10
- **Estado**: Aceptada

## Contexto

La app es CRUD puro: capturar movimientos, listarlos, agregarlos por mes. El tamaño del
equipo es uno. Cada pieza de infraestructura extra (API REST propia, TanStack Query,
un store global) es superficie que mantener y otra forma más de tener el mismo dato
en dos lugares.

## Decisión

- **Lecturas**: Server Components leen de Supabase con la sesión del usuario.
- **Escrituras**: Server Actions que validan, escriben y devuelven un mensaje de error
  o `null`; la UI revalida con `revalidatePath`.
- **Sin API propia** (nadie más consume estos datos) y **sin librería de estado en el
  cliente**: el estado del cliente es efímero (formularios, diálogos) y vive en
  `useState` local.

## Consecuencias

- ✅ Un solo lugar donde vive la verdad: Postgres. El cliente es cache de render,
  no fuente de datos.
- ✅ Menos JavaScript al teléfono (las vistas llegan renderizadas) — parte del
  Lighthouse 100 de performance.
- ✅ Cada mutación queda tipada de punta a punta dentro del mismo repo.
- ⚠️ Cada escritura viaja al servidor: no hay optimistic updates. Aceptable para
  capturas de un gasto; se revisará si usuarios reales piden más fluidez (TanStack
  Query quedó como etapa 2 explícitamente pospuesta).
- ⚠️ Server Actions acoplan la app a Next.js. Tradeoff asumido: el framework ya era
  parte del stack.
