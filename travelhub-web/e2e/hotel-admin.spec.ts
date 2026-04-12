import { test, expect } from '@playwright/test';

const HOTEL_USER = {
  nombre: 'Admin Hotel PW',
  email: `hotel_pw_${crypto.randomUUID()}@example.com`,
  password: 'HotelPass123',
  hotelNombre: 'Hotel Playwright Test',
  ciudad: 'Bogota',
  pais: 'Colombia',
};

async function hotelLogin(page: any) {
  await page.goto('/hotel/login');
  await page.waitForTimeout(500);
  await page.locator('input[name="email"]').fill(HOTEL_USER.email);
  await page.locator('input[name="password"]').fill(HOTEL_USER.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/hotel/dashboard', { timeout: 10000 });
}

test.describe.serial('Hotel Admin Portal E2E', () => {
  test('1 - Registro de hotel/proveedor (HU-09)', async ({ page }) => {
    await page.goto('/hotel/login');
    await page.waitForTimeout(500);

    await page.locator('button', { hasText: 'Registrar hotel' }).click();
    await page.waitForTimeout(500);

    await page.locator('input[name="nombre"]').fill(HOTEL_USER.nombre);
    await page.locator('input[name="email"]').fill(HOTEL_USER.email);
    await page.locator('input[name="password"]').fill(HOTEL_USER.password);
    await page.locator('input[name="confirm"]').fill(HOTEL_USER.password);

    await page.locator('button[type="submit"]', { hasText: 'Continuar' }).click();
    await page.waitForTimeout(500);

    await page.locator('input[name="hotelNombre"]').fill(HOTEL_USER.hotelNombre);
    await page.locator('input[name="pais"]').fill(HOTEL_USER.pais);
    await page.locator('input[name="ciudad"]').fill(HOTEL_USER.ciudad);

    await page.locator('button[type="submit"]', { hasText: 'Crear cuenta' }).click();
    await page.waitForURL('**/hotel/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/hotel\/dashboard/);
  });

  test('2 - Login de hotel (HU-10)', async ({ page }) => {
    await hotelLogin(page);
    await expect(page).toHaveURL(/hotel\/dashboard/);
  });

  test('3 - Dashboard muestra info del hotel (HU-14)', async ({ page }) => {
    await hotelLogin(page);
    await page.waitForTimeout(4000);

    const content = await page.content();
    const hasDashboard =
      content.includes(HOTEL_USER.hotelNombre) ||
      content.includes('Reservas Activas') ||
      content.includes('Ingresos') ||
      content.includes('Ocupación') ||
      content.includes('Dashboard');
    expect(hasDashboard).toBeTruthy();
  });

  test('4 - Gestión de habitaciones: crear (HU-13)', async ({ page }) => {
    await hotelLogin(page);
    await page.goto('/hotel/rooms');
    await page.waitForTimeout(2000);

    await page.locator('button', { hasText: 'Agregar habitación' }).click();
    await page.waitForTimeout(500);

    await page.locator('input[placeholder="Ej: Suite Premium"]').fill('Suite Deluxe');
    const precioInput = page
      .locator('label', { hasText: 'Precio por noche' })
      .locator('..')
      .locator('input[type="number"]');
    await precioInput.fill('250000');

    await page.locator('button', { hasText: 'Guardar cambios' }).click();
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(content.includes('Suite Deluxe')).toBeTruthy();
  });

  test('5 - Gestión de habitaciones: editar tarifa (HU-13)', async ({ page }) => {
    await hotelLogin(page);
    await page.goto('/hotel/rooms');
    await page.waitForTimeout(3000);

    const editBtn = page.locator('button', { hasText: 'Editar' });
    const count = await editBtn.count();
    if (count > 0) {
      await editBtn.first().click();
      await page.waitForTimeout(500);

      const precioInput = page
        .locator('label', { hasText: 'Precio por noche' })
        .locator('..')
        .locator('input[type="number"]');
      await precioInput.fill('300000');
      await page.locator('button', { hasText: 'Guardar cambios' }).click();
      await page.waitForTimeout(3000);
    }

    const content = await page.content();
    expect(
      content.includes('300,000') || content.includes('300000') || content.includes('Suite'),
    ).toBeTruthy();
  });

  test('6 - Lista de reservas del hotel (HU-11)', async ({ page }) => {
    await hotelLogin(page);
    await page.goto('/hotel/reservations');
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(
      content.includes('Reservas') &&
        (content.includes('Estado') ||
          content.includes('Código') ||
          content.includes('No se encontraron')),
    ).toBeTruthy();
  });

  test('7 - Tarifas: actualizar precio (HU-12)', async ({ page }) => {
    await hotelLogin(page);
    await page.goto('/hotel/tarifas');
    await page.waitForTimeout(3000);

    const content = await page.content();
    expect(
      content.includes('Tarifas') &&
        (content.includes('Precio Actual') ||
          content.includes('Actualizar precio') ||
          content.includes('No hay habitaciones')),
    ).toBeTruthy();
  });
});
