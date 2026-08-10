-- DiNelo · Fase 2 — Semillas (correr UNA sola vez, DESPUÉS de esquema.sql)
-- Los UUID son las 2 cuentas reales creadas en Authentication → Users (2026-08-10).

-- Perfiles: B amarillo, N rosa (colores de avatar del Dash)
insert into public.profiles (id, nombre, inicial, color) values
  ('bb8ae675-86b1-4438-99a3-c767f084f2ef', 'Brayan', 'B', 'f-y'),
  ('c7a5695b-e471-43ff-a4c8-634d3eb9c384', 'Nelo',   'N', 'f-p');

-- Categorías iniciales (compartidas) — las 5 del mock; después se administran desde Conf.
insert into public.categorias (nombre, color) values
  ('Comida',     'f-y'),
  ('Súper',      'f-p'),
  ('Transporte', 'f-b'),
  ('Salidas',    'f-gg'),
  ('Casa',       'f-g');

-- Medios y frecuentes arrancan VACÍOS a propósito:
-- cada quien crea los suyos desde Conf en su teléfono (estreno real del CRUD).
