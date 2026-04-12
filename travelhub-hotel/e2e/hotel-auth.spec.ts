import { test, expect, Page } from '@playwright/test';

// Email independiente por suite — sin colisiones entre ejecuciones paralelas
const REGISTER_USER = {
  nombre: 'Hotel Playwright Registro',
  email: `hotel_reg_${crypto.randomUUID()}@example.com`,
  password: 'HotelPass123',
  hotelNombre: 'Hotel PW Test Registro',
  ciudad: 'Bogota',
  direccion: 'Calle 123 # 45-67',
};

const LOGIN_USER = {
  nombre: 'Hotel Playwright Login',
  email: `hotel_login_${crypto.randomUUID()}@example.com`,
  password: 'HotelPass123',
  hotelNombre: 'Hotel PW Test Login',
  ciudad: 'Medellin',
  direccion: 'Carrera 80 # 10-20',
};

// =========================================================
// Helpers
// =========================================================

async function goToLogin(page: Page): Promise<void> {
  await page.goto('/login');
  await page.waitForTimeout(500);
}

async function goToRegister(page: Page): Promise<void> {
  await page.goto('/register');
  await page.waitForTimeout(500);
}

async function fillStep1(page: Page, user: typeof REGISTER_USER): Promise<void> {
  await page.locator('input[name="nombre"]').fill(user.nombre);
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await page.locator('input[name="confirmPassword"]').fill(user.password);
}

async function fillStep2(page: Page, user: typeof REGISTER_USER): Promise<void> {
  await page.locator('input[name="hotelNombre"]').fill(user.hotelNombre);
  await page.locator('input[name="hotelCiudad"]').fill(user.ciudad);
  await page.locator('input[name="hotelDireccion"]').fill(user.direccion);
}

async function registerFull(page: Page, user: typeof REGISTER_USER): Promise<void> {
  await goToRegister(page);
  await fillStep1(page, user);
  await page.getByRole('button', { name: /Continuar/i }).click();
  await page.waitForTimeout(500);
  await fillStep2(page, user);
  await page.getByRole('button', { name: /Crear cuenta/i }).click();
}

// =========================================================
// Registro de hotel
// =========================================================

test.describe.serial('Registro de hotel', () => {
  test('muestra el paso 1 del formulario de registro', async ({ page }) => {
    await goToRegister(page);
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });

  test('muestra error al enviar paso 1 vacío', async ({ page }) => {
    await goToRegister(page);
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('muestra error con email inválido en paso 1', async ({ page }) => {
    await goToRegister(page);
    await page.locator('input[name="nombre"]').fill('Admin');
    await page.locator('input[name="email"]').fill('no-es-email');
    await page.locator('input[name="password"]').fill('HotelPass123');
    await page.locator('input[name="confirmPassword"]').fill('HotelPass123');
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('muestra error cuando contraseñas no coinciden', async ({ page }) => {
    await goToRegister(page);
    await page.locator('input[name="nombre"]').fill('Admin');
    await page.locator('input[name="email"]').fill(REGISTER_USER.email);
    await page.locator('input[name="password"]').fill('HotelPass123');
    await page.locator('input[name="confirmPassword"]').fill('OtraPass456');
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('avanza al paso 2 con datos válidos del usuario', async ({ page }) => {
    await goToRegister(page);
    await fillStep1(page, REGISTER_USER);
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('input[name="hotelNombre"]')).toBeVisible();
  });

  test('muestra error al enviar paso 2 vacío', async ({ page }) => {
    await goToRegister(page);
    await fillStep1(page, REGISTER_USER);
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Crear cuenta/i }).click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('registro completo exitoso muestra confirmación', async ({ page }) => {
    await goToRegister(page);
    await fillStep1(page, REGISTER_USER);
    await page.getByRole('button', { name: /Continuar/i }).click();
    await page.waitForTimeout(500);
    await fillStep2(page, REGISTER_USER);

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('sign-up'), { timeout: 10000 }),
      page.getByRole('button', { name: /Crear cuenta/i }).click(),
    ]);

    expect(response.status()).toBe(201);
    await expect(page.getByText('¡Cuenta creada!')).toBeVisible({ timeout: 5000 });
  });
});

// =========================================================
// Login de hotel
// =========================================================

test.describe.serial('Login de hotel', () => {
  test.beforeAll(async ({ browser }) => {
    // Registrar el usuario antes de correr los tests de login
    const page = await browser.newPage();
    await registerFull(page, LOGIN_USER);
    await page.waitForTimeout(3000);
    await page.close();
  });

  test('muestra el formulario de login', async ({ page }) => {
    await goToLogin(page);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('muestra error con campos vacíos', async ({ page }) => {
    await goToLogin(page);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('muestra error con credenciales incorrectas', async ({ page }) => {
    await goToLogin(page);
    await page.locator('input[name="email"]').fill('noexiste@hotel.com');
    await page.locator('input[name="password"]').fill('WrongPass999');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('login exitoso redirige al dashboard', async ({ page }) => {
    await goToLogin(page);
    await page.locator('input[name="email"]').fill(LOGIN_USER.email);
    await page.locator('input[name="password"]').fill(LOGIN_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });
});
