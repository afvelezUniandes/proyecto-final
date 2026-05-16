import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

const mockApiService = {
  post: () => of({ message: 'User created' }),
  uploadFile: () => of({}),
};

const mockAuthService = {
  isLoggedIn: () => false,
  setToken: (_token: string) => {},
  fetchProfile: () => {},
};

async function createComponent() {
  await TestBed.configureTestingModule({
    imports: [RegisterComponent],
    providers: [
      { provide: ApiService, useValue: mockApiService },
      { provide: AuthService, useValue: mockAuthService },
      provideRouter([]),
      provideHttpClient(),
      provideTranslateService({ fallbackLang: 'es' }),
    ],
  }).compileComponents();

  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('es', {
    AUTH: {
      ERR_NAME_REQUIRED: 'El nombre es requerido.',
      ERR_EMAIL_REQUIRED: 'El correo es requerido.',
      ERR_WEAK_PASSWORD:
        'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.',
      ERR_MISMATCH: 'Las contraseñas no coinciden.',
      ERR_HOTEL_NAME: 'El nombre del hotel es requerido.',
      ERR_CITY: 'La ciudad es requerida.',
      ERR_ADDRESS: 'La dirección es requerida.',
      ERR_IMAGE_SIZE: 'La imagen no puede superar 5 MB.',
      ERR_EMAIL_TAKEN: 'Ya existe una cuenta con ese correo.',
      ERR_CREATE: 'Error al crear la cuenta. Intenta de nuevo.',
    },
  });
  translate.use('es');

  const fixture = TestBed.createComponent(RegisterComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  return { fixture, component };
}

describe('RegisterComponent', () => {
  it('debería crearse correctamente', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  it('inicia en el paso 1', async () => {
    const { component } = await createComponent();
    expect(component.step()).toBe(1);
  });

  describe('nextStep - validación paso 1', () => {
    it('muestra error si el nombre está vacío', async () => {
      const { component } = await createComponent();
      component.nextStep();
      expect(component.error()).toBe('El nombre es requerido.');
    });

    it('muestra error si el correo está vacío', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.nextStep();
      expect(component.error()).toBe('El correo es requerido.');
    });

    it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'Ab1@';
      component.confirmPassword = 'Ab1@';
      component.nextStep();
      expect(component.error()).toContain('mínimo 8 caracteres');
    });

    it('muestra error si la contraseña no tiene mayúscula', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'hotelpass1@';
      component.confirmPassword = 'hotelpass1@';
      component.nextStep();
      expect(component.error()).toContain('mayúscula');
    });

    it('muestra error si la contraseña no tiene número', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'HotelPass@abc';
      component.confirmPassword = 'HotelPass@abc';
      component.nextStep();
      expect(component.error()).toContain('número');
    });

    it('muestra error si la contraseña no tiene carácter especial', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'HotelPass123';
      component.confirmPassword = 'HotelPass123';
      component.nextStep();
      expect(component.error()).toContain('carácter especial');
    });

    it('muestra error si las contraseñas no coinciden', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'HotelPass1@';
      component.confirmPassword = 'OtraPass2#';
      component.nextStep();
      expect(component.error()).toBe('Las contraseñas no coinciden.');
    });

    it('avanza al paso 2 con datos válidos', async () => {
      const { component } = await createComponent();
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'HotelPass1@';
      component.confirmPassword = 'HotelPass1@';
      component.nextStep();
      expect(component.step()).toBe(2);
      expect(component.error()).toBeNull();
    });
  });

  describe('prevStep', () => {
    it('regresa al paso 1', async () => {
      const { component } = await createComponent();
      component.step.set(2);
      component.prevStep();
      expect(component.step()).toBe(1);
    });
  });

  describe('onRegister - validación paso 2', () => {
    it('muestra error si el nombre del hotel está vacío', async () => {
      const { component } = await createComponent();
      component.onRegister();
      expect(component.error()).toBe('El nombre del hotel es requerido.');
    });

    it('muestra error si la ciudad está vacía', async () => {
      const { component } = await createComponent();
      component.hotelNombre = 'Mi Hotel';
      component.onRegister();
      expect(component.error()).toBe('La ciudad es requerida.');
    });

    it('muestra error si la dirección está vacía', async () => {
      const { component } = await createComponent();
      component.hotelNombre = 'Mi Hotel';
      component.hotelCiudad = 'Bogotá';
      component.onRegister();
      expect(component.error()).toBe('La dirección es requerida.');
    });
  });

  describe('onRegister - flujo completo', () => {
    function fillHotelFields(component: RegisterComponent) {
      component.nombre = 'Admin Hotel';
      component.email = 'admin@hotel.com';
      component.password = 'HotelPass1@';
      component.hotelNombre = 'Hotel Test';
      component.hotelCiudad = 'Bogotá';
      component.hotelDireccion = 'Cra 7 # 10-20';
    }

    it('llama a api.post con los datos correctos', async () => {
      const postSpy = vi.spyOn(mockApiService, 'post').mockReturnValue(of({ message: 'ok' }));
      const { component } = await createComponent();
      fillHotelFields(component);
      component.onRegister();
      expect(postSpy).toHaveBeenCalledWith(
        '/auth/sign-up',
        expect.objectContaining({
          nombre: 'Admin Hotel',
          email: 'admin@hotel.com',
          rol: 'hotel',
          hotel: expect.objectContaining({
            nombre: 'Hotel Test',
            ciudad: 'Bogotá',
          }),
        }),
      );
    });

    it('muestra éxito al registrarse correctamente', async () => {
      vi.spyOn(mockApiService, 'post').mockReturnValue(of({ message: 'ok' }));
      const { component } = await createComponent();
      fillHotelFields(component);
      component.onRegister();
      expect(component.success()).toBe(true);
    });

    it('llama a fetchProfile directamente cuando hay token pero no imagen', async () => {
      vi.spyOn(mockApiService, 'post').mockReturnValue(
        of({ message: 'ok', token: 'fake-token', hotel_id: 1 }),
      );
      const fetchSpy = vi.spyOn(mockAuthService, 'fetchProfile');
      const { component } = await createComponent();
      fillHotelFields(component);
      component.onRegister();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('espera el upload de imagen antes de llamar a fetchProfile', async () => {
      vi.spyOn(mockApiService, 'post').mockReturnValue(
        of({ message: 'ok', token: 'fake-token', hotel_id: 42 }),
      );
      const uploadSpy = vi.spyOn(mockApiService, 'uploadFile').mockReturnValue(of({}));
      const fetchSpy = vi.spyOn(mockAuthService, 'fetchProfile');
      const { component } = await createComponent();
      fillHotelFields(component);
      component.hotelImageFile = new File(['data'], 'hotel.jpg', { type: 'image/jpeg' });
      component.onRegister();
      expect(uploadSpy).toHaveBeenCalledWith('/catalog/hotels/42/image', component.hotelImageFile);
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('llama a fetchProfile aunque falle el upload de imagen', async () => {
      vi.spyOn(mockApiService, 'post').mockReturnValue(
        of({ message: 'ok', token: 'fake-token', hotel_id: 42 }),
      );
      vi.spyOn(mockApiService, 'uploadFile').mockReturnValue(
        throwError(() => new Error('upload error')),
      );
      const fetchSpy = vi.spyOn(mockAuthService, 'fetchProfile');
      const { component } = await createComponent();
      fillHotelFields(component);
      component.hotelImageFile = new File(['data'], 'hotel.jpg', { type: 'image/jpeg' });
      component.onRegister();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('muestra error de correo duplicado cuando el backend retorna 409', async () => {
      vi.spyOn(mockApiService, 'post').mockReturnValue(throwError(() => ({ status: 409 })));
      const { component } = await createComponent();
      fillHotelFields(component);
      component.onRegister();
      expect(component.error()).toBe('Ya existe una cuenta con ese correo.');
      expect(component.step()).toBe(1);
    });

    it('muestra error genérico ante fallo del servidor', async () => {
      vi.spyOn(mockApiService, 'post').mockReturnValue(throwError(() => ({ status: 500 })));
      const { component } = await createComponent();
      fillHotelFields(component);
      component.onRegister();
      expect(component.error()).toBe('Error al crear la cuenta. Intenta de nuevo.');
    });
  });

  describe('onImageFileSelected', () => {
    it('guarda el archivo y genera preview si es válido', async () => {
      const { component } = await createComponent();
      const file = new File(['contenido'], 'hotel.jpg', { type: 'image/jpeg' });
      const fakeEvent = { target: { files: [file], value: '' } } as unknown as Event;

      component.onImageFileSelected(fakeEvent);

      expect(component.hotelImageFile).toBe(file);
    });

    it('muestra error si el archivo supera 5 MB', async () => {
      const { component } = await createComponent();
      const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'grande.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(bigFile, 'size', { value: 6 * 1024 * 1024 });
      const inputEl = { files: [bigFile], value: '' };
      const fakeEvent = { target: inputEl } as unknown as Event;

      component.onImageFileSelected(fakeEvent);

      expect(component.error()).toBe('La imagen no puede superar 5 MB.');
      expect(component.hotelImageFile).toBeNull();
    });

    it('limpia el error previo al seleccionar un archivo válido', async () => {
      const { component } = await createComponent();
      component.error.set('Error anterior');
      const file = new File(['data'], 'foto.png', { type: 'image/png' });
      const fakeEvent = { target: { files: [file], value: '' } } as unknown as Event;

      component.onImageFileSelected(fakeEvent);

      expect(component.error()).toBeNull();
    });

    it('no hace nada si no se seleccionó ningún archivo', async () => {
      const { component } = await createComponent();
      const fakeEvent = { target: { files: [] } } as unknown as Event;

      component.onImageFileSelected(fakeEvent);

      expect(component.hotelImageFile).toBeNull();
    });
  });
});
