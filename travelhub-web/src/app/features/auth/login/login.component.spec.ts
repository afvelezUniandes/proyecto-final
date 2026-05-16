import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

const mockAuthService = {
  login: () => of({}),
  register: () => of({ message: 'ok' }),
};

const esTranslations = {
  AUTH: {
    ERR_EMPTY_FIELDS: 'Por favor completa todos los campos.',
    ERR_INVALID_EMAIL: 'Ingresa un correo electrónico válido.',
    ERR_WEAK_PASSWORD:
      'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.',
    ERR_PASSWORD_MISMATCH: 'Las contraseñas no coinciden.',
    ERR_EMAIL_TAKEN: 'Este correo ya está registrado.',
    ERR_REGISTER: 'Error al registrar. Intenta de nuevo.',
    ERR_WRONG_CREDENTIALS: 'Credenciales incorrectas.',
    ERR_CONNECT: 'Error al conectar. Intenta de nuevo.',
    SUCCESS_REGISTER: '¡Cuenta creada! Ahora inicia sesión.',
  },
};

async function createComponent() {
  await TestBed.configureTestingModule({
    imports: [LoginComponent],
    providers: [
      { provide: AuthService, useValue: mockAuthService },
      provideRouter([]),
      provideHttpClient(),
      provideTranslateService({ fallbackLang: 'es' }),
    ],
  }).compileComponents();

  const translateService = TestBed.inject(TranslateService);
  translateService.setTranslation('es', esTranslations);
  translateService.use('es');

  const fixture = TestBed.createComponent(LoginComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  return { fixture, component };
}

describe('LoginComponent', () => {
  it('debería crearse correctamente', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  describe('onRegister - validación de campos vacíos', () => {
    it('muestra error si algún campo está vacío', async () => {
      const { component } = await createComponent();
      component.onRegister();
      expect(component.registerError()).toBe('Por favor completa todos los campos.');
    });

    it('muestra error si falta el correo', async () => {
      const { component } = await createComponent();
      component.registerNombre = 'Juan';
      component.registerPassword = 'Pass1@seg';
      component.registerConfirm = 'Pass1@seg';
      component.onRegister();
      expect(component.registerError()).toBe('Por favor completa todos los campos.');
    });
  });

  describe('onRegister - validación de correo', () => {
    it('muestra error con correo inválido', async () => {
      const { component } = await createComponent();
      component.registerNombre = 'Juan';
      component.registerEmail = 'no-es-email';
      component.registerPassword = 'Pass1@seg';
      component.registerConfirm = 'Pass1@seg';
      component.onRegister();
      expect(component.registerError()).toBe('Ingresa un correo electrónico válido.');
    });
  });

  describe('onRegister - validación de contraseña', () => {
    const baseFields = { registerNombre: 'Juan', registerEmail: 'juan@test.com' };

    it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
      const { component } = await createComponent();
      Object.assign(component, baseFields);
      component.registerPassword = 'Ab1@';
      component.registerConfirm = 'Ab1@';
      component.onRegister();
      expect(component.registerError()).toContain('mínimo 8 caracteres');
    });

    it('muestra error si la contraseña no tiene mayúscula', async () => {
      const { component } = await createComponent();
      Object.assign(component, baseFields);
      component.registerPassword = 'password1@';
      component.registerConfirm = 'password1@';
      component.onRegister();
      expect(component.registerError()).toContain('mayúscula');
    });

    it('muestra error si la contraseña no tiene número', async () => {
      const { component } = await createComponent();
      Object.assign(component, baseFields);
      component.registerPassword = 'Password@abc';
      component.registerConfirm = 'Password@abc';
      component.onRegister();
      expect(component.registerError()).toContain('número');
    });

    it('muestra error si la contraseña no tiene carácter especial', async () => {
      const { component } = await createComponent();
      Object.assign(component, baseFields);
      component.registerPassword = 'Password123';
      component.registerConfirm = 'Password123';
      component.onRegister();
      expect(component.registerError()).toContain('carácter especial');
    });

    it('acepta contraseña con todos los requisitos cumplidos', async () => {
      const { component } = await createComponent();
      Object.assign(component, baseFields);
      component.registerPassword = 'TestPass1@';
      component.registerConfirm = 'TestPass1@';
      component.onRegister();
      // Si la contraseña es válida, el error de contraseña no se establece
      const err = component.registerError();
      expect(err === null || (!err.includes('mayúscula') && !err.includes('mínimo'))).toBe(true);
    });
  });

  describe('onRegister - confirmación de contraseña', () => {
    it('muestra error si las contraseñas no coinciden', async () => {
      const { component } = await createComponent();
      component.registerNombre = 'Juan';
      component.registerEmail = 'juan@test.com';
      component.registerPassword = 'TestPass1@';
      component.registerConfirm = 'OtraPass2#';
      component.onRegister();
      expect(component.registerError()).toBe('Las contraseñas no coinciden.');
    });
  });

  describe('onRegister - flujo completo', () => {
    it('llama a auth.register con los datos correctos al pasar todas las validaciones', async () => {
      const registerSpy = vi
        .spyOn(mockAuthService, 'register')
        .mockReturnValue(of({ message: 'ok' }));
      const { component } = await createComponent();
      component.registerNombre = 'Juan Test';
      component.registerEmail = 'juan@test.com';
      component.registerPassword = 'TestPass1@';
      component.registerConfirm = 'TestPass1@';
      component.onRegister();
      expect(registerSpy).toHaveBeenCalledWith({
        nombre: 'Juan Test',
        email: 'juan@test.com',
        password: 'TestPass1@',
      });
    });

    it('muestra mensaje de éxito al registrarse correctamente', async () => {
      vi.spyOn(mockAuthService, 'register').mockReturnValue(of({ message: 'ok' }));
      const { component } = await createComponent();
      component.registerNombre = 'Juan';
      component.registerEmail = 'juan@test.com';
      component.registerPassword = 'TestPass1@';
      component.registerConfirm = 'TestPass1@';
      component.onRegister();
      expect(component.registerSuccess()).toBe('¡Cuenta creada! Ahora inicia sesión.');
    });

    it('muestra error de correo duplicado cuando el backend retorna 409', async () => {
      vi.spyOn(mockAuthService, 'register').mockReturnValue(throwError(() => ({ status: 409 })));
      const { component } = await createComponent();
      component.registerNombre = 'Juan';
      component.registerEmail = 'juan@test.com';
      component.registerPassword = 'TestPass1@';
      component.registerConfirm = 'TestPass1@';
      component.onRegister();
      expect(component.registerError()).toBe('Este correo ya está registrado.');
    });

    it('muestra error genérico ante fallo del servidor', async () => {
      vi.spyOn(mockAuthService, 'register').mockReturnValue(throwError(() => ({ status: 500 })));
      const { component } = await createComponent();
      component.registerNombre = 'Juan';
      component.registerEmail = 'juan@test.com';
      component.registerPassword = 'TestPass1@';
      component.registerConfirm = 'TestPass1@';
      component.onRegister();
      expect(component.registerError()).toBe('Error al registrar. Intenta de nuevo.');
    });
  });
});
