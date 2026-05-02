/**
 * global-teardown.ts
 * Limpia la DB de pruebas después de cada ejecución de Playwright:
 * - Cancela todas las reservas (libera habitaciones para la siguiente ejecución)
 * - Elimina usuarios de prueba creados por los tests (sufijo @example.com, @test.com)
 *
 * Conecta directamente a la DB usando las mismas variables de entorno que docker-compose.ci.yml.
 */
import { Client } from 'pg';

export default async function globalTeardown() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'travelhub_user',
    password: 'travelhub_pass',
    database: 'travelhub',
  });

  try {
    await client.connect();

    // 1. Cancelar todas las reservas confirmadas creadas por usuarios de prueba
    //    (identificados por email con dominio @example.com generado por crypto.randomUUID)
    await client.query(`
      UPDATE reservation.reservas
      SET estado = 'cancelada'
      WHERE estado = 'confirmada'
        AND usuario_id IN (
          SELECT id FROM public.usuarios
          WHERE email LIKE '%@example.com'
             OR email LIKE '%_pw_%@example.com'
        )
    `);

    // 2. Eliminar usuarios de prueba (esto también elimina sus reservas por cascade, si aplica)
    //    Solo los creados por los tests Playwright (patrón test_pw_ y hotel_pw_)
    await client.query(`
      DELETE FROM public.usuarios
      WHERE email LIKE 'test_pw_%@example.com'
         OR email LIKE 'hotel_pw_%@example.com'
    `);

    console.log('✓ Playwright teardown: reservas canceladas y usuarios de prueba eliminados');
  } catch (err) {
    // No fallar la suite si el teardown falla (puede que la DB no esté disponible en CI)
    console.warn('⚠ Playwright teardown skipped:', (err as Error).message);
  } finally {
    await client.end();
  }
}
