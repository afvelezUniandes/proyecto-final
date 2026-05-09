-- Migración: agrega la columna `eliminada` a catalog.habitaciones (soft delete)
-- HU: eliminar habitación — conservar histórico de reservas.
-- Idempotente: usa IF NOT EXISTS para que se pueda ejecutar varias veces.

ALTER TABLE catalog.habitaciones
    ADD COLUMN IF NOT EXISTS eliminada BOOLEAN NOT NULL DEFAULT FALSE;
