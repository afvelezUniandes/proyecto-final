-- Migración: agrega la columna `descripcion` a catalog.habitaciones
-- HU: gestión de habitaciones desde el portal de hoteles.
-- Idempotente: usa IF NOT EXISTS para que se pueda ejecutar varias veces.

ALTER TABLE catalog.habitaciones
    ADD COLUMN IF NOT EXISTS descripcion TEXT;
