import { test, expect, Page } from '@playwright/test';

// Usuario único por corrida — sin colisiones entre ejecuciones paralelas
const HOTEL_USER = {
  nombre: 'Admin Hotel PW',
  email: `hotel_pw_${crypto.randomUUID()}@example.com`,
  password: 'HotelPass123',
  hotelNombre: 'Hotel Playwright Test',
  ciudad: 'Bogota',
  pais: 'Colombia',
};

// =========================================================
// Helpers
// =========================================================

async function goToHotelLogin(page: Page): Promise<void> {
  await page.goto('/hotel/login');
  await page.waitForTimeout(500);
}

async function goToHotelRegister(page: Page): Promise<void> {
  await goToHotelLogin(page);
  await page.locator('button', { hasText: 'Registrar hotel' }).click();
  await page.waitForTimeout(500);
}

async function fillHotelUserForm(page: Page): Promise<void> {
  await page.locator('input[name="nombre"]').fill(HOTEL_USER.nombre);
  await page.locator('input[name="email"]').fill(HOTEL_USER.email);
  await page.locator('input[name="password"]').fill(HOTEL_USER.password);
  await page.locator('input[name="confirm"]').fill(HOTEL_USER.password);
}

// =========================================================
// Registro de hotel/proveedor
// =========================================================

test.describe.serial('Registro de hotel (travelhub-hotel)', () => {
  test('muestra el formulario de registro al hacer clic en Registrar hotel', async ({ page }) => {
    await goToHotelRegister(page);
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirm"]')).toBeVisible();
  });

  test('muestra error al enviar formulario vacío', async ({ page }) => {
    await goToHotelRegister(page);
    await page.locator('button[type="submit"]', { hasText: 'Continuar' }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/hotel\/dashboard/);
  });

  test('muestra error con email inválido', async ({ page }) => {
    await goToHotelRegister(page);
    await page.locator('input[name="nombre"]').fill('Admin');
    await page.locator('input[name="email"]').fill('no-es-email');
    await page.locator('input[name="password"]').fill('HotelPass123');
    await page.locator('input[name="confirm"]').fill('HotelPass123');
    await page.locator('button[type="submit"]', { hasText: 'Continuar' }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/hotel\/dashboard/);
  });

  test('muestra error cuando contraseñas no coinciden', async ({ page }) => {
    await goToHotelRegister(page);
    await page.locator('input[name="nombre"]').fill('Admin');
    await page.locator('input[name="email"]').fill(HOTEL_USER.email);
    await page.locator('input[name="password"]').fill('HotelPass123');
    await page.locator('input[name="confirm"]').fill('OtraPass456');
    await page.locator('button[type="submit"]', { hasText: 'Continuar' }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/hotel\/dashboard/);
  });

  test('registro exitoso: paso 1 datos de usuario', async ({ page }) => {
    await goToHotelRegister(page);
    await fillHotelUserForm(page);
    await page.locator('button[type="submit"]', { hasText: 'Continuar' }).click();
    await page.waitForTimeout(500);
    // Debe avanzar al paso 2 (datos del hotel)
    await expect(page.locator('input[name="hotelNombre"]')).toBeVisible();
  });

  test('registro exitoso: paso 2 datos del hotel y redirect a dashboard', async ({ page }) => {
    await goToHotelRegister(page);
    await fillHotelUserForm(page);
    await page.locator('button[type="submit"]', { hasText: 'Continuar' }).click();
    await page.waitForTimeout(500);

    await page.locator('input[name="hotelNombre"]').fill(HOTEL_USER.hotelNombre);
    await page.locator('input[name="pais"]').fill(HOTEL_USER.pais);
    await page.locator('input[name="ciudad"]').fill(HOTEL_USER.ciudad);
    await page.locator('button[type="submit"]', { hasText: 'Crear cuenta' }).click();
    await page.waitForURL('**/hotel/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/hotel\/dashboard/);
  });
});

// =========================================================
// Login de hotel/proveedor
// =========================================================

test.describe.serial('Login de hotel (travelhub-hotel)', () => {
  test('muestra el formulario de login al cargar /hotel/login', async ({ page }) => {
    await goToHotelLogin(page);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('muestra error con campos vacíos', async ({ page }) => {
    await goToHotelLogin(page);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/hotel\/dashboard/);
  });

  test('muestra error con email inválido', async ({ page }) => {
    await goToHotelLogin(page);
    await page.locator('input[name="email"]').fill('no-es-email');
    await page.locator('input[name="password"]').fill('HotelPass123');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/hotel\/dashboard/);
  });

  test('muestra error con credenciales incorrectas', async ({ page }) => {
    await goToHotelLogin(page);
    await page.locator('input[name="email"]').fill('noexiste@hotel.com');
    await page.locator('input[name="password"]').fill('WrongPass999');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveURL(/hotel\/dashboard/);
  });

  test('login exitoso con hotel registrado', async ({ page }) => {
    await goToHotelLogin(page);
    await page.locator('input[name="email"]').fill(HOTEL_USER.email);
    await page.locator('input[name="password"]').fill(HOTEL_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/hotel/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/hotel\/dashboard/);
  });
});
