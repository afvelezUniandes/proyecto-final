-- Seed data para TravelHub (schema: catalog)
-- Crea 100 hoteles y 10 habitaciones por hotel (1000 habitaciones)
-- Ajusta la cantidad cambiando los parámetros: hotel_count y rooms_per_hotel

BEGIN;

-- Opcional: limpia primero (si estás en ambiente de pruebas)
-- OJO: respeta dependencias si tienes FKs desde otros schemas.
-- TRUNCATE TABLE catalog.habitaciones RESTART IDENTITY;
-- TRUNCATE TABLE catalog.hoteles RESTART IDENTITY;

DO $$
DECLARE
  hotel_count INT := 100;
  rooms_per_hotel INT := 10;
BEGIN
  -- 1) Hoteles
  INSERT INTO catalog.hoteles
    (id, admin_id, descripcion, estrellas, activo, fecha_creacion,
     nombre, ciudad, pais, direccion, image_url)
  SELECT
    gs AS id,
    ((gs - 1) % 10) + 1 AS admin_id,                               -- rota admin_id 1..10
    'Hotel de prueba #' || gs || ' para experimento de carga.' AS descripcion,
    ((gs - 1) % 5) + 1 AS estrellas,                               -- 1..5
    TRUE AS activo,
    NOW() - ((gs % 30) || ' days')::interval AS fecha_creacion,
    'TravelHub Hotel ' || LPAD(gs::text, 3, '0') AS nombre,
    'Ciudad ' || ((gs - 1) % 20 + 1) AS ciudad,                    -- 20 ciudades
    'Colombia' AS pais,
    'Calle ' || ((gs - 1) % 200 + 1) || ' # ' || ((gs - 1) % 50 + 1) || '-' || ((gs - 1) % 99 + 1) AS direccion,
    'https://picsum.photos/seed/travelhub-hotel-' || gs || '/800/600' AS image_url
  FROM generate_series(1, hotel_count) gs;

  -- 2) Habitaciones (10 por hotel)
  INSERT INTO catalog.habitaciones
    (id, hotel_id, capacidad, disponible, nombre, tipo, precio_noche, moneda, imagen_url)
  SELECT
    (h.id - 1) * rooms_per_hotel + r.rn AS id,
    h.id AS hotel_id,
    CASE
      WHEN (r.rn % 10) IN (1,2,3,4) THEN 2
      WHEN (r.rn % 10) IN (5,6,7)   THEN 3
      WHEN (r.rn % 10) IN (8,9)     THEN 4
      ELSE 1
    END AS capacidad,
    CASE WHEN (r.rn % 7) = 0 THEN FALSE ELSE TRUE END AS disponible, -- algunas no disponibles
    'Hab ' || LPAD(h.id::text, 3, '0') || '-' || LPAD(r.rn::text, 2, '0') AS nombre,
    CASE
      WHEN (r.rn % 5) = 0 THEN 'Suite'
      WHEN (r.rn % 5) = 1 THEN 'Standard'
      WHEN (r.rn % 5) = 2 THEN 'Deluxe'
      WHEN (r.rn % 5) = 3 THEN 'Familiar'
      ELSE 'Economy'
    END AS tipo,
    ROUND((
      40
      + (h.estrellas * 25)
      + (r.rn * 3)
      + ((h.id % 10) * 2)
    )::numeric, 2) AS precio_noche,
    'COP' AS moneda,
    'https://picsum.photos/seed/travelhub-room-' || h.id || '-' || r.rn || '/900/650' AS imagen_url
  FROM catalog.hoteles h
  CROSS JOIN LATERAL generate_series(1, rooms_per_hotel) AS r(rn)
  WHERE h.id BETWEEN 1 AND hotel_count;

  -- 3) Ajusta las secuencias si tus IDs son SERIAL (recomendado)
  -- Nota: si tus secuencias tienen otro nombre, cambia el string.
  PERFORM setval('catalog.hoteles_id_seq', (SELECT MAX(id) FROM catalog.hoteles), true);
  PERFORM setval('catalog.habitaciones_id_seq', (SELECT MAX(id) FROM catalog.habitaciones), true);
END $$;

COMMIT;