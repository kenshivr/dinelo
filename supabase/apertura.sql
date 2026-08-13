-- DiNelo · Apertura — perfil y categorías automáticos al registrarse (trigger)
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez.
-- El switch "Allow new users to sign up" se prende DESPUÉS de deployar /registro.

-- security definer: corre como dueño (esquiva RLS — profiles no tiene policy de
-- insert a propósito); search_path vacío + nombres calificados por seguridad.
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

  -- categorías default: arrancar con Configuración vacía es mala bienvenida
  insert into public.categorias (user_id, nombre, color) values
    (new.id, 'Comida',     'f-y'),
    (new.id, 'Transporte', 'f-b'),
    (new.id, 'Casa',       'f-g'),
    (new.id, 'Salud',      'f-r'),
    (new.id, 'Gustos',     'f-p');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo();
