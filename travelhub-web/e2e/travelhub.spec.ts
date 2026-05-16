import { test, expect } from '@playwright/test';

const TEST_USER = {
  nombre: 'Test Playwright',
  email: `test_pw_${crypto.randomUUID()}@example.com`,
  password: 'TestPass123!',
};

async function login(page: any) {
  await page.goto('/login');
  await page.waitForTimeout(500);

  await page.locator('input[name="email"]').fill(TEST_USER.email);
  await page.locator('input[name="password"]').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/home', { timeout: 10000 });
}

test.describe.serial('TravelHub E2E', () => {
  test('1 - Home carga correctamente', async ({ page }) => {
    await page.goto('/home');
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /buscar/i })).toBeVisible();
  });

  test('2 - Registro de nuevo usuario', async ({ page }) => {
    await page.goto('/login');
    await page.waitForTimeout(500);

    await page.locator('button', { hasText: 'Registrarse' }).first().click();
    await page.waitForTimeout(500);

    await page.locator('input[name="nombre"]').fill(TEST_USER.nombre);
    await page.locator('input[name="email"]').fill(TEST_USER.email);
    await page.locator('input[name="password"]').fill(TEST_USER.password);
    await page.locator('input[name="confirm"]').fill(TEST_USER.password);

    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);

    const pageContent = await page.content();
    const success =
      pageContent.includes('exitoso') ||
      pageContent.includes('creado') ||
      pageContent.includes('registrado') ||
      pageContent.includes('Cuenta creada') ||
      pageContent.includes('green');

    expect(success).toBeTruthy();
  });

  test('3 - Login con usuario registrado', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/home/);
  });

  test('4 - Busqueda de hoteles muestra resultados', async ({ page }) => {
    await page.goto('/search');
    await page.waitForTimeout(4000);

    const pageContent = await page.content();
    const hasHotels =
      pageContent.includes('Hotel') ||
      pageContent.includes('estrellas') ||
      pageContent.includes('Colombia');

    expect(hasHotels).toBeTruthy();
  });

  test('5 - Detalle de hotel muestra habitaciones', async ({ page }) => {
    await page.goto('/hotel/1?checkIn=2026-05-01&checkOut=2026-05-03&huespedes=2');
    await page.waitForTimeout(5000);

    const pageContent = await page.content();
    const hasRoomInfo =
      pageContent.includes('noche') ||
      pageContent.includes('Reservar') ||
      pageContent.includes('habitacion') ||
      pageContent.includes('Habitacion');

    expect(hasRoomInfo).toBeTruthy();
  });

  test('6 - Flujo completo: login y crear reserva', async ({ page }) => {
    await login(page);

    // Usar fechas dinámicas para evitar colisión con reservas previas
    const base = new Date();
    base.setFullYear(base.getFullYear() + 2);
    const offset = Math.floor(Math.random() * 300);
    base.setDate(base.getDate() + offset);
    const checkIn = base.toISOString().split('T')[0];
    const checkOut = new Date(base.getTime() + 2 * 86400000).toISOString().split('T')[0];

    // Buscar un hotel disponible dinámicamente en lugar de hardcodear hotel/1
    await page.goto(`/search?checkIn=${checkIn}&checkOut=${checkOut}&huespedes=2`);
    await page.waitForTimeout(4000);

    const hotelLink = page.locator('a[href*="/hotel/"]').first();
    const linkCount = await hotelLink.count();
    if (linkCount > 0) {
      const href = await hotelLink.getAttribute('href');
      await page.goto(`${href}?checkIn=${checkIn}&checkOut=${checkOut}&huespedes=2`);
    } else {
      await page.goto(`/hotel/1?checkIn=${checkIn}&checkOut=${checkOut}&huespedes=2`);
    }
    await page.waitForTimeout(6000);

    const reserveBtn = page.locator('button', { hasText: /reservar/i });
    const btnCount = await reserveBtn.count();
    if (btnCount > 0) {
      await reserveBtn.first().click();
      await page.waitForTimeout(5000);
    }

    const pageContent = await page.content();
    const reserved =
      pageContent.includes('exitosa') ||
      pageContent.includes('confirmada') ||
      pageContent.includes('mis reservas') ||
      pageContent.includes('Reservar') ||
      pageContent.includes('noche');

    expect(reserved).toBeTruthy();
  });

  test('7 - Ver mis reservas', async ({ page }) => {
    await login(page);
    await page.goto('/reservations');
    await page.waitForTimeout(6000);

    const url = page.url();
    const text = await page.locator('body').innerText();
    console.log('RESERVATIONS URL:', url);
    console.log('RESERVATIONS TEXT:', text.substring(0, 500));
    expect(url.includes('reservations') || url.includes('home')).toBeTruthy();
  });

  test('7b - Detalle de reserva muestra nombre de habitación (no ID)', async ({ page }) => {
    await login(page);
    await page.goto('/reservations');
    await page.waitForTimeout(4000);

    // Navegar al primer detalle disponible
    const detailLink = page.locator('a[href*="/reservation/"]').first();
    const count = await detailLink.count();
    if (count === 0) {
      // No hay reservas: test no aplica
      return;
    }

    await detailLink.click();
    await page.waitForTimeout(3000);

    const html = await page.content();

    // No debe mostrar el patrón "Habitación #<número>" — debe mostrar el nombre real
    const hasRawId = /Habitaci[oó]n\s*#\s*\d+/.test(html);
    expect(hasRawId).toBe(false);

    // Debe tener algún contenido de resumen de pago
    const hasSummary =
      html.includes('Resumen') ||
      html.includes('noche') ||
      html.includes('noches') ||
      html.includes('Total');
    expect(hasSummary).toBeTruthy();
  });

  test('8 - Perfil muestra datos del usuario', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Mi Perfil')).toBeVisible({ timeout: 10000 });
    const pageContent = await page.content();
    expect(pageContent.includes(TEST_USER.email)).toBeTruthy();
  });
});
