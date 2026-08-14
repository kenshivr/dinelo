-- DiNelo · Fase 2 — Esquema Supabase (tablas + RLS)
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez.
-- Modelo: DINELO.md §4 — profiles, categorias (compartidas), medios (personales),
-- frecuentes (compartidos), movimientos (personales, visibles ambos en Dash).
-- Las 2 cuentas se crean en el dashboard (Auth) y sus perfiles con semillas.sql (siguiente paso).

-- ═══ Tablas ═════════════════════════════════════════════════════════

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  nombre     text not null,
  inicial    text not null,
  color      text not null check (color in ('f-y','f-p','f-g','f-gg','f-b','f-r')),
  avatar_url text,
  created_at timestamptz not null default now()
);
-- El correo NO se duplica aquí: vive en auth.users y la vista Cuenta lo lee de la sesión.
-- "desde" del perfil = created_at. Sin trigger de signup: los signups quedan cerrados,
-- los 2 perfiles se insertan a mano una única vez.

create table public.categorias (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  -- 15 colores desde 2026-08-14 (colores-categorias.sql amplió el check original de 6)
  color      text not null check (color in (
    'f-y','f-p','f-g','f-gg','f-b','f-r',
    'f-o','f-l','f-t','f-c','f-v','f-f','f-m','f-ca','f-n'
  )),
  created_at timestamptz not null default now()
);

create table public.medios (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  nombre     text not null,
  emoji      text not null,
  tipo       text,
  created_at timestamptz not null default now()
);

create table public.frecuentes (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  emoji      text not null,
  tipo       text not null check (tipo in ('G','I')),
  created_at timestamptz not null default now()
);

create table public.movimientos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  tipo         text not null check (tipo in ('gasto','ingreso')),
  concepto     text not null,
  monto        numeric(10,2) not null check (monto > 0),
  categoria_id uuid references public.categorias (id) on delete restrict,
  medio_id     uuid not null references public.medios (id) on delete restrict,
  fecha        date not null default current_date,
  created_at   timestamptz not null default now(),
  -- un gasto SIEMPRE lleva categoría; un ingreso NUNCA (así lo dibujan las vistas)
  constraint gasto_con_categoria check (
    (tipo = 'gasto'   and categoria_id is not null) or
    (tipo = 'ingreso' and categoria_id is null)
  )
);
-- on delete RESTRICT: una categoría o medio CON movimientos no se puede borrar
-- (la app avisa; borrar historia ajena por accidente sería peor).

-- Dash e Historial consultan por mes
create index movimientos_fecha_idx      on public.movimientos (fecha desc);
create index movimientos_user_fecha_idx on public.movimientos (user_id, fecha desc);

-- ═══ RLS ════════════════════════════════════════════════════════════
-- Con RLS activo y políticas solo para `authenticated`, el rol anon (URL pública)
-- NO ve nada. Y `authenticated` = únicamente B y N, porque los signups quedan cerrados.

alter table public.profiles    enable row level security;
alter table public.categorias  enable row level security;
alter table public.medios      enable row level security;
alter table public.frecuentes  enable row level security;
alter table public.movimientos enable row level security;

-- profiles: ambos se ven (Dash muestra avatares y nombres B/N); cada quien edita SOLO el suyo.
create policy "ver perfiles" on public.profiles
  for select to authenticated using (true);
create policy "editar mi perfil" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- Sin INSERT/DELETE desde la app: los perfiles se siembran una vez y no se borran.

-- categorias: COMPARTIDAS — una sola lista, ambos leen y editan todo.
create policy "categorias compartidas" on public.categorias
  for all to authenticated using (true) with check (true);

-- frecuentes: COMPARTIDOS — igual que categorías.
create policy "frecuentes compartidos" on public.frecuentes
  for all to authenticated using (true) with check (true);

-- medios: PERSONALES para escribir, pero AMBOS los leen
-- (el Dash muestra "categoría · medio" también en los movimientos del otro).
create policy "ver medios de ambos" on public.medios
  for select to authenticated using (true);
create policy "crear mis medios" on public.medios
  for insert to authenticated with check (user_id = auth.uid());
create policy "editar mis medios" on public.medios
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "borrar mis medios" on public.medios
  for delete to authenticated using (user_id = auth.uid());

-- movimientos: ambos LEEN todo (Dash con detalle item por item);
-- cada quien crea/edita/borra SOLO lo suyo (Gastos, Ingresos, Historial).
create policy "ver movimientos de ambos" on public.movimientos
  for select to authenticated using (true);
create policy "crear mis movimientos" on public.movimientos
  for insert to authenticated with check (user_id = auth.uid());
create policy "editar mis movimientos" on public.movimientos
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "borrar mis movimientos" on public.movimientos
  for delete to authenticated using (user_id = auth.uid());
