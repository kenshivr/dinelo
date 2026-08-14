-- DiNelo · Post-v1 — Apartados (tab Control): dinero comprometido del mes
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez.
-- Modelo: el flujo del Excel de N — al cobrar se reparte el dinero en apartados
-- (renta, luz…) y el Dash muestra el LIBRE real. Un apartado NO es un gasto:
-- al tocar "ya lo pagué" se crea el movimiento con la fecha REAL y se ligan.

create table public.apartados (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  nombre        text not null,
  monto         numeric(10,2) not null check (monto > 0),
  mes           text not null, -- yyyy-mm del teléfono al crearlo
  -- opcional al crear; se exige (y se guarda) al pagar
  categoria_id  uuid references public.categorias (id) on delete set null,
  -- null = pendiente. Si el gasto ligado se borra del Historial, el apartado
  -- REGRESA a pendiente solo (set null) — el plan revive si el hecho se deshace.
  movimiento_id uuid references public.movimientos (id) on delete set null,
  created_at    timestamptz not null default now()
);

create index apartados_user_mes_idx on public.apartados (user_id, mes);

-- ═══ RLS ════════════════════════════════════════════════════════════

alter table public.apartados enable row level security;

-- PERSONALES de verdad, como metas: ni lectura de lo ajeno.
create policy "mis apartados" on public.apartados
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
