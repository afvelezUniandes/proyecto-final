-- Migración: Agregar campo fecha_cancelacion a la tabla reservas
-- Fecha: 2026-05-05
-- Descripción: Permite registrar la fecha en que se canceló una reserva

-- Para PostgreSQL
ALTER TABLE reservation.reservas 
ADD COLUMN IF NOT EXISTS fecha_cancelacion TIMESTAMP;

COMMENT ON COLUMN reservation.reservas.fecha_cancelacion IS 'Fecha y hora en que se canceló la reserva';
