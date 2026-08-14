-- Más colores de categoría (2026-08-14): de 6 a 15.
-- Correr en el SQL Editor de Supabase ANTES de desplegar el código que los usa
-- (si no, guardar una categoría con color nuevo revienta contra el check viejo).
-- Solo categorias: los avatares de profiles siguen con los 6 originales.

alter table public.categorias drop constraint categorias_color_check;
alter table public.categorias add constraint categorias_color_check
  check (color in (
    'f-y','f-p','f-g','f-gg','f-b','f-r',
    'f-o','f-l','f-t','f-c','f-v','f-f','f-m','f-ca','f-n'
  ));
