-- DiNelo · Post-v1 — Categoría OPCIONAL en gastos
-- Se pega COMPLETO en el SQL Editor de Supabase y se corre UNA sola vez,
-- ANTES de deployar la app que manda gastos sin categoría.
-- Antes el check exigía categoría en TODO gasto. Ahora un gasto puede ir sin
-- (null = "Sin categoría" en la app); un ingreso sigue sin llevar NUNCA.

alter table public.movimientos drop constraint gasto_con_categoria;
alter table public.movimientos add constraint gasto_con_categoria
  check (tipo = 'gasto' or categoria_id is null);
