import { test, expect, Page } from '@playwright/test';

// Email independiente por suite para evitar colisión cuando ambas suites corren en la misma corrida
const REGISTER_USER = {
  nombre: 'Test Playwright Registro',
  email: `test_reg_${crypto.randomUUID()}@example.com`,
  password: 'TestPass123',
};

const LOGIN_USER = {
  nombre: 'Test Playwright Login',
  email: `test_login_${crypto.randomUUID()}@example.com`,
  password: 'TestPass123',
};

// =========================================================
// Helpers
// =========================================================

async function goToRegister(page: Page): Promise<void> {
  await page.goto('/login');
  await page.waitForTimeout(500);
  await page.locator('button', { hasText: 'Registrarse' }).click();
  await page.waitForTimeout(500);
}

async function fillRegisterForm(page: Page, user = REGISTER_USER): Promise<void> {
  await page.locator('input[name="nombre"]').fill(user.nombre);
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await page.locator('input[name="confirm"]').fill(user.password);
}

async function goToLogin(page: Page): Promise<void> {
  await page.goto('/login');
  await page.waitForTimeout(500);
}

async function fillLoginForm(page: Page, email: string, password: string): Promise<void> {
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
}

// =========================================================
// Registro de usuario cliente
// =========================================================

test.describe.serial('Registro de usuario (travelhub-web)', () => {
  test('muestra el formulario de registro al navegar desde login', async ({ page }) => {
    await goToRegister(page);
    await expect(page.locator('input[name="nombre"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirm"]')).toBeVisible();
  });

  test('muestra error al enviar formulario vacío', async ({ page }) => {
    await goToRegister(page);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    // Debe seguir en la misma pantalla (no redirige)
    await expect(page).not.toHaveURL(/home/);
  });

  test('muestra error con email inválido', async ({ page }) => {
    await goToRegister(page);
    await page.locator('input[name="nombre"]').fill('Juan');
    await page.locator('input[name="email"]').fill('no-es-un-email');
    await page.locator('input[name="password"]').fill('TestPass123');
    await page.locator('input[name="confirm"]').fill('TestPass123');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/home/);
  });

  test('muestra error cuando contraseñas no coinciden', async ({ page }) => {
    await goToRegister(page);
    await page.locator('input[name="nombre"]').fill('Juan');
    await page.locator('input[name="email"]').fill(REGISTER_USER.email);
    await page.locator('input[name="password"]').fill('TestPass123');
    await page.locator('input[name="confirm"]').fill('OtraPass456');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/home/);
  });

  test('registro exitoso con datos válidos', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page);
    await page.locator('button[type="submit"]').click();

    // El mensaje aparece brevemente (1.5s) antes de redirigir al tab de login
    await expect(page.getByText('Cuenta creada')).toBeVisible({ timeout: 8000 });
  });
});

// =========================================================
// Login de usuario cliente
// =========================================================

test.describe.serial('Login de usuario (travelhub-web)', () => {
  test.beforeAll(async ({ browser }) => {
    // Registrar el usuario antes de los tests de login
    const page = await browser.newPage();
    await page.goto('/login');
    await page.waitForTimeout(500);
    await page.locator('button', { hasText: 'Registrarse' }).click();
    await page.waitForTimeout(500);
    await page.locator('input[name="nombre"]').fill(LOGIN_USER.nombre);
    await page.locator('input[name="email"]').fill(LOGIN_USER.email);
    await page.locator('input[name="password"]').fill(LOGIN_USER.password);
    await page.locator('input[name="confirm"]').fill(LOGIN_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await page.close();
  });
  test('muestra el formulario de login al cargar /login', async ({ page }) => {
    await goToLogin(page);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('muestra error con campos vacíos', async ({ page }) => {
    await goToLogin(page);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/home/);
  });

  test('muestra error con email inválido', async ({ page }) => {
    await goToLogin(page);
    await fillLoginForm(page, 'no-es-email', 'TestPass123');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);
    await expect(page).not.toHaveURL(/home/);
  });

  test('muestra error con credenciales incorrectas', async ({ page }) => {
    await goToLogin(page);
    await fillLoginForm(page, 'noexiste@example.com', 'WrongPass999');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    await expect(page).not.toHaveURL(/home/);
  });

  test('login exitoso con usuario registrado', async ({ page }) => {
    await goToLogin(page);
    await fillLoginForm(page, LOGIN_USER.email, LOGIN_USER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/home', { timeout: 10000 });
    await expect(page).toHaveURL(/home/);
  });
});
