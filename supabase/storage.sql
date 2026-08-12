-- DiNelo · Storage — bucket de avatares (tanda auth-escrituras)
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez.

-- Bucket PÚBLICO: el avatar se lee por URL directa (la app la guarda en
-- profiles.avatar_url). Escribir solo puede cada quien, sobre SU archivo:
-- el nombre del objeto es exactamente "{uid}.jpg".
insert into storage.buckets (id, name, public) values ('avatares', 'avatares', true);

create policy "subir mi avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatares' and name = auth.uid()::text || '.jpg');

-- el upsert de reemplazar la foto necesita también UPDATE
create policy "reemplazar mi avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatares' and name = auth.uid()::text || '.jpg')
  with check (bucket_id = 'avatares' and name = auth.uid()::text || '.jpg');

-- SELECT es OBLIGATORIA aunque el bucket sea público: lo público cubre la
-- lectura por URL (CDN), pero el flujo de SUBIDA consulta storage.objects
-- como el usuario (existencia del upsert + returning) y sin esta política
-- truena con el engañoso "new row violates row-level security policy".
create policy "ver avatares" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatares');
