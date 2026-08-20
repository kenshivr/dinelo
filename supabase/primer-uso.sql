-- DiNelo · Primer uso — la app lista para alguien que la abre por primera vez
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez,
-- ANTES de deployar la app (la versión actual sigue funcionando con estos cambios).
-- (1) las cuentas nuevas nacen con 3 categorías y 2 medios base;
-- (2) el medio pasa a ser opcional en movimientos;
-- (3) borrar una categoría o un medio ya no bloquea: sus movimientos quedan
--     "Sin categoría" / "Sin medio". Los aportes de Metas SÍ siguen bloqueando
--     el borrado de su medio (un aporte sin medio no significa nada).

-- ═══ 1. Trigger de apertura v2 ═════════════════════════════════════
-- Reemplaza la función de apertura.sql; el trigger on_auth_user_created
-- ya existe y sigue apuntando a ella. Solo afecta a cuentas NUEVAS.

create or replace function public.crear_perfil_nuevo()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  nombre_nuevo text;
  colores text[] := array['f-y','f-p','f-g','f-gg','f-b','f-r'];
begin
  -- nombre: viene del form de registro (metadata); si no, lo de antes de la @
  nombre_nuevo := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, nombre, inicial, color)
  values (
    new.id,
    nombre_nuevo,
    upper(left(nombre_nuevo, 1)),
    colores[1 + floor(random() * 6)::int]
  );

  -- lo justo para registrar el primer gasto sin pasar por Configuración
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

-- ═══ 2. Medio opcional ══════════════════════════════════════════════

alter table public.movimientos alter column medio_id drop not null;

-- ═══ 3. Borrar categoría / medio → sus movimientos quedan sin ella ══
-- (los apartados ya hacían set null con su categoría desde apartados.sql)

-- las FKs se buscan por columna (no se asume su nombre) y se recrean con set null
do $$
declare fk record;
begin
  for fk in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'public.movimientos'::regclass
      and con.contype = 'f'
      and att.attname in ('categoria_id', 'medio_id')
  loop
    execute format('alter table public.movimientos drop constraint %I', fk.conname);
  end loop;
end $$;

alter table public.movimientos
  add constraint movimientos_categoria_id_fkey
    foreign key (categoria_id) references public.categorias (id) on delete set null,
  add constraint movimientos_medio_id_fkey
    foreign key (medio_id) references public.medios (id) on delete set null;

-- aportes.medio_id conserva su on delete restrict A PROPÓSITO.
