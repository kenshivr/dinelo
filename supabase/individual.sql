-- DiNelo · Post-v1 — App 100% INDIVIDUAL (aprieta el RLS)
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez.
-- Antes: movimientos, medios y perfiles se LEÍAN entre ambos (el Dash era compartido).
-- Ahora: cada quien ve SOLO lo suyo — lo garantiza la base, no el código.
-- OJO: categorias y frecuentes siguen COMPARTIDAS (migrarlas a personales es
-- una migración de datos aparte — pendiente de decisión).

-- movimientos: de "ver de ambos" a solo míos
drop policy "ver movimientos de ambos" on public.movimientos;
create policy "ver mis movimientos" on public.movimientos
  for select to authenticated using (user_id = auth.uid());

-- medios: de "ver de ambos" a solo míos
drop policy "ver medios de ambos" on public.medios;
create policy "ver mis medios" on public.medios
  for select to authenticated using (user_id = auth.uid());

-- perfiles: de "ver ambos" a solo el mío
drop policy "ver perfiles" on public.profiles;
create policy "ver mi perfil" on public.profiles
  for select to authenticated using (id = auth.uid());
