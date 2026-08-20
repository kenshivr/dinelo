-- DiNelo · Aportes sin medio obligatorio + borrar medio → aportes sin medio
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez,
-- ANTES de deployar la app (la versión actual sigue funcionando).
-- Cierra la regla única de la app: borrar una categoría o un medio NUNCA
-- bloquea — todo lo que lo usaba (movimientos, apartados, aportes) queda
-- "Sin categoría" / "Sin medio".

-- 1. al aportar a una meta el medio es opcional
alter table public.aportes alter column medio_id drop not null;

-- 2. borrar un medio ya no bloquea por sus aportes (antes: on delete restrict)
do $$
declare fk record;
begin
  for fk in
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attrelid = con.conrelid and att.attnum = any(con.conkey)
    where con.conrelid = 'public.aportes'::regclass
      and con.contype = 'f'
      and att.attname = 'medio_id'
  loop
    execute format('alter table public.aportes drop constraint %I', fk.conname);
  end loop;
end $$;

alter table public.aportes
  add constraint aportes_medio_id_fkey
    foreign key (medio_id) references public.medios (id) on delete set null;
