-- DiNelo · Post-v1 — Metas de ahorro (tablas + RLS)
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez.
-- Modelo: metas PERSONALES (cada quien ve SOLO las suyas, ni lectura de lo ajeno)
-- con historial de aportes. Mundo aparte de movimientos: aportar NO crea gasto ni ingreso.

-- ═══ Tablas ═════════════════════════════════════════════════════════

create table public.metas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  nombre      text not null,
  descripcion text not null default '',
  objetivo    numeric(10,2) not null check (objetivo > 0),
  created_at  timestamptz not null default now()
);

create table public.aportes (
  id         uuid primary key default gen_random_uuid(),
  meta_id    uuid not null references public.metas (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  medio_id   uuid not null references public.medios (id) on delete restrict,
  monto      numeric(10,2) not null check (monto > 0),
  fecha      date not null,
  created_at timestamptz not null default now()
);
-- Borrar la meta se lleva sus aportes (cascade). Un medio con aportes no se
-- puede borrar (restrict — mismo criterio que movimientos).

create index aportes_meta_idx on public.aportes (meta_id, created_at desc);

-- ═══ RLS ════════════════════════════════════════════════════════════

alter table public.metas   enable row level security;
alter table public.aportes enable row level security;

-- PERSONALES de verdad: a diferencia de movimientos, NI lectura de lo ajeno.
create policy "mis metas" on public.metas
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mis aportes" on public.aportes
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
