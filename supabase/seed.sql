-- DiNelo · seed.sql — toda la base de datos en un archivo (estado final, agosto 2026)
-- Proyecto de Supabase NUEVO y vacío: pegar COMPLETO en el SQL Editor y correr una vez.
-- No es una migración: no correr sobre un proyecto que ya tenga la app.
-- Después, en Authentication: proveedor Email activo, "Confirm email" apagado, contraseña mínima 8.
--
-- Reglas que explican el diseño:
--   · TODO es personal: cada cuenta ve y toca solo lo suyo (RLS, no la app).
--   · Borrar una categoría o un medio NUNCA bloquea: lo que lo usaba queda "sin" (set null).
--   · Borrar la cuenta en auth.users se lleva todo en cascada.

-- ═══ Tablas ═══════════════════════════════════════════════════════════════

create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    nombre text not null,
    inicial text not null,
    color text not null check (
        color in (
            'f-y',
            'f-p',
            'f-g',
            'f-gg',
            'f-b',
            'f-r'
        )
    ),
    avatar_url text,
    created_at timestamptz not null default now()
);
-- El correo vive en auth.users; la app lo lee de la sesión.

create table public.categorias (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    nombre text not null,
    color text not null check (
        color in (
            'f-y',
            'f-p',
            'f-g',
            'f-gg',
            'f-b',
            'f-r',
            'f-o',
            'f-l',
            'f-t',
            'f-c',
            'f-v',
            'f-f',
            'f-m',
            'f-ca',
            'f-n'
        )
    ),
    created_at timestamptz not null default now()
);

create table public.medios (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    nombre text not null,
    emoji text not null,
    tipo text,
    -- punto de partida del saldo en Control › Medios (la app arranca a medio camino)
    saldo_inicial numeric(10, 2) not null default 0,
    created_at timestamptz not null default now()
);

-- Alimentan el desplegable de concepto en Gastos (G) e Ingresos (I).
create table public.frecuentes (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    nombre text not null,
    emoji text not null,
    tipo text not null check (tipo in ('G', 'I')),
    created_at timestamptz not null default now()
);

create table public.movimientos (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    tipo text not null check (tipo in ('gasto', 'ingreso')),
    concepto text not null,
    monto numeric(10, 2) not null check (monto > 0),
    categoria_id uuid references public.categorias (id) on delete set null,
    medio_id uuid references public.medios (id) on delete set null,
    fecha date not null default current_date, -- la app manda la del teléfono
    created_at timestamptz not null default now(),
    -- categoría opcional en gastos; un ingreso nunca lleva
    constraint gasto_con_categoria check (
        tipo = 'gasto'
        or categoria_id is null
    )
);

create index movimientos_fecha_idx on public.movimientos (fecha desc);

create index movimientos_user_fecha_idx on public.movimientos (user_id, fecha desc);

-- Metas de ahorro con historial de aportes. Aportar NO crea movimiento.
create table public.metas (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    nombre text not null,
    descripcion text not null default '',
    objetivo numeric(10, 2) not null check (objetivo > 0),
    created_at timestamptz not null default now()
);

create table public.aportes (
    id uuid primary key default gen_random_uuid (),
    meta_id uuid not null references public.metas (id) on delete cascade,
    user_id uuid not null references public.profiles (id) on delete cascade,
    medio_id uuid references public.medios (id) on delete set null,
    monto numeric(10, 2) not null check (monto > 0),
    fecha date not null,
    created_at timestamptz not null default now()
);

create index aportes_meta_idx on public.aportes (meta_id, created_at desc);

-- Dinero comprometido del mes. "Ya lo pagué" crea el gasto real y lo liga;
-- si ese gasto se borra, el apartado vuelve a pendiente (set null).
create table public.apartados (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    nombre text not null,
    monto numeric(10, 2) not null check (monto > 0),
    mes text not null, -- yyyy-mm
    categoria_id uuid references public.categorias (id) on delete set null,
    movimiento_id uuid references public.movimientos (id) on delete set null,
    created_at timestamptz not null default now()
);

create index apartados_user_mes_idx on public.apartados (user_id, mes);

-- Mover dinero entre medios: no es gasto ni ingreso (el Dash no las ve),
-- solo cambia el saldo de las dos cards en Control › Medios.
create table public.transferencias (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references public.profiles (id) on delete cascade,
    origen_id uuid references public.medios (id) on delete set null,
    destino_id uuid references public.medios (id) on delete set null,
    monto numeric(10, 2) not null check (monto > 0),
    fecha date not null, -- la app manda la del teléfono
    created_at timestamptz not null default now(),
    constraint medios_distintos check (origen_id <> destino_id)
);

create index transferencias_user_idx on public.transferencias (user_id, created_at desc);

-- ═══ RLS: solo lo propio, solo autenticados (el rol anon no ve nada) ══════

alter table public.profiles enable row level security;

alter table public.categorias enable row level security;

alter table public.medios enable row level security;

alter table public.frecuentes enable row level security;

alter table public.movimientos enable row level security;

alter table public.metas enable row level security;

alter table public.aportes enable row level security;

alter table public.apartados enable row level security;

alter table public.transferencias enable row level security;

-- profiles: sin insert ni delete desde la app (los hace el trigger y el borrado de cuenta)
create policy "ver mi perfil" on public.profiles for
select to authenticated using (id = auth.uid ());

create policy "editar mi perfil" on public.profiles for
update to authenticated using (id = auth.uid ())
with
    check (id = auth.uid ());

create policy "mis categorias" on public.categorias for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis medios" on public.medios for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis frecuentes" on public.frecuentes for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis movimientos" on public.movimientos for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis metas" on public.metas for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis aportes" on public.aportes for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis apartados" on public.apartados for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

create policy "mis transferencias" on public.transferencias for all to authenticated using (user_id = auth.uid ())
with
    check (user_id = auth.uid ());

-- ═══ Primer uso: cada cuenta nueva nace con perfil, 3 categorías y 2 medios ══

-- security definer: inserta en profiles sin política de insert (corre como dueño)
create or replace function public.crear_perfil_nuevo()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  nombre_nuevo text;
  colores text[] := array['f-y','f-p','f-g','f-gg','f-b','f-r'];
begin
  -- nombre del form de registro; si no llega, lo de antes de la @
  nombre_nuevo := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, nombre, inicial, color)
  values (new.id, nombre_nuevo, upper(left(nombre_nuevo, 1)), colores[1 + floor(random() * 6)::int]);

  insert into public.categorias (user_id, nombre, color) values
    (new.id, 'Comida',     'f-y'),
    (new.id, 'Transporte', 'f-b'),
    (new.id, 'Diversión',  'f-p');

  insert into public.medios (user_id, nombre, emoji) values
    (new.id, 'Efectivo', '💵'),
    (new.id, 'Banco',    '🏦');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo();

-- ═══ Storage: fotos de perfil ═════════════════════════════════════════════

-- Bucket público (se lee por URL); cada quien escribe solo "{uid}.jpg".
insert into
    storage.buckets (id, name, public)
values ('avatares', 'avatares', true);

create policy "subir mi avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatares' and name = auth.uid()::text || '.jpg');

create policy "reemplazar mi avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatares' and name = auth.uid()::text || '.jpg')
  with check (bucket_id = 'avatares' and name = auth.uid()::text || '.jpg');
-- necesaria aunque el bucket sea público: el upsert consulta storage.objects como el usuario
create policy "ver avatares" on storage.objects for
select to authenticated using (bucket_id = 'avatares');