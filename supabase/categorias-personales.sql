-- DiNelo · Post-v1 — Categorías y frecuentes PERSONALES (migración de datos + RLS)
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez,
-- DESPUÉS de individual.sql. Cierra la app 100% individual.
-- Estrategia: cada perfil recibe SU COPIA de cada categoría/frecuente existente
-- (nadie pierde nada) y los movimientos de cada quien se remapean a sus copias.

-- ═══ Categorías ═════════════════════════════════════════════════════

alter table public.categorias
  add column user_id uuid references public.profiles (id) on delete cascade;

-- correspondencia exacta: vieja → (usuario, nueva)
create temp table mapa_cat as
select c.id as vieja, p.id as usuario, gen_random_uuid() as nueva
from public.categorias c
cross join public.profiles p
where c.user_id is null;

insert into public.categorias (id, nombre, color, user_id, created_at)
select m.nueva, c.nombre, c.color, m.usuario, c.created_at
from mapa_cat m
join public.categorias c on c.id = m.vieja;

-- cada movimiento pasa a apuntar a LA COPIA de su dueño
update public.movimientos mv
set categoria_id = m.nueva
from mapa_cat m
where mv.categoria_id = m.vieja
  and m.usuario = mv.user_id;

-- las originales sin dueño ya no las referencia nadie
delete from public.categorias where user_id is null;
alter table public.categorias alter column user_id set not null;

drop policy "categorias compartidas" on public.categorias;
create policy "mis categorias" on public.categorias
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ═══ Frecuentes ═════════════════════════════════════════════════════
-- (sin FKs que los referencien: alcanza con duplicar y borrar originales)

alter table public.frecuentes
  add column user_id uuid references public.profiles (id) on delete cascade;

insert into public.frecuentes (nombre, emoji, tipo, user_id, created_at)
select f.nombre, f.emoji, f.tipo, p.id, f.created_at
from public.frecuentes f
cross join public.profiles p
where f.user_id is null;

delete from public.frecuentes where user_id is null;
alter table public.frecuentes alter column user_id set not null;

drop policy "frecuentes compartidos" on public.frecuentes;
create policy "mis frecuentes" on public.frecuentes
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
