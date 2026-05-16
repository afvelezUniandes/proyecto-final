import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ReservationDetailComponent } from './reservation-detail.component';
import { ReservationService } from '../../core/services/reservation.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Reservation, Hotel } from '../../core/models';

const mockHotel: Hotel = {
  id: 1,
  nombre: 'Hotel Caribe',
  ciudad: 'Cartagena',
  pais: 'Colombia',
  estrellas: 4,
  activo: true,
};

const mockReservationWithName: Reservation = {
  id: 42,
  habitacion_id: 10,
  habitacion_nombre: 'Suite Caribe',
  hotel_id: 1,
  fecha_checkin: '2026-06-01',
  fecha_checkout: '2026-06-03',
  num_huespedes: 2,
  monto_total: 1000000,
  moneda: 'COP',
  estado: 'confirmada',
  codigo: 'TH-2026-0042',
};

const mockReservationWithoutName: Reservation = {
  id: 43,
  habitacion_id: 15,
  hotel_id: 1,
  fecha_checkin: '2026-07-01',
  fecha_checkout: '2026-07-04',
  num_huespedes: 1,
  monto_total: 600000,
  moneda: 'COP',
  estado: 'confirmada',
  codigo: 'TH-2026-0043',
};

const TRANSLATIONS = {
  RESERVATION_DETAIL: {
    ROOM_PREFIX: 'Habitación #',
    BACK_TO_LIST: 'Volver a mis reservas',
    BACK_BTN: 'Volver',
    PAYMENT_SUMMARY: 'Resumen de pago',
    STAY_DETAILS: 'Detalles de estadía',
    CHECKIN: 'Check-in',
    CHECKOUT: 'Check-out',
    DURATION: 'Duración',
    NIGHTS: 'noches',
    GUESTS: 'Huéspedes',
    GUEST_SINGULAR: 'huéspedes',
    TOTAL: 'Total',
    CANCEL_BTN: 'Cancelar reserva',
    CANCELLING: 'Cancelando...',
    CANCELLED_OK: 'Reserva cancelada',
    BREADCRUMB: 'Mis reservas',
    CREATED_ON: 'Creada el',
    NOT_FOUND: 'No se encontró la reserva.',
  },
  RESERVATIONS: { BOOKING_PREFIX: 'Reserva #' },
  RESERVATION: {
    STATUS: { confirmada: 'Confirmada', cancelada: 'Cancelada', completada: 'Completada' },
  },
  COMMON: { SKIP_TO_CONTENT: 'Saltar al contenido' },
};

async function createComponent(
  overrides: {
    reservation?: Reservation;
    hotelError?: boolean;
    cancelFn?: ReturnType<typeof vi.fn>;
    reservationError?: boolean;
  } = {},
) {
  const reservation = overrides.reservation ?? mockReservationWithName;

  const mockReservationService = {
    getReservation: overrides.reservationError
      ? vi.fn().mockReturnValue(throwError(() => new Error('Not found')))
      : vi.fn().mockReturnValue(of(reservation)),
    cancelReservation: overrides.cancelFn ?? vi.fn().mockReturnValue(of({})),
  };

  const mockCatalogService = {
    getHotel: overrides.hotelError
      ? vi.fn().mockReturnValue(throwError(() => new Error('Not found')))
      : vi.fn().mockReturnValue(of(mockHotel)),
  };

  await TestBed.configureTestingModule({
    imports: [ReservationDetailComponent],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideTranslateService({ fallbackLang: 'es' }),
      { provide: ReservationService, useValue: mockReservationService },
      { provide: CatalogService, useValue: mockCatalogService },
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => '42' } } },
      },
    ],
  }).compileComponents();

  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('es', TRANSLATIONS);
  translate.use('es');

  const fixture = TestBed.createComponent(ReservationDetailComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, mockReservationService, mockCatalogService };
}

describe('ReservationDetailComponent', () => {
  it('debe crearse correctamente', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - carga de datos', () => {
    it('carga la reserva y el hotel al iniciar', async () => {
      const { component, mockReservationService, mockCatalogService } = await createComponent();
      expect(mockReservationService.getReservation).toHaveBeenCalledWith(42);
      expect(mockCatalogService.getHotel).toHaveBeenCalledWith(1);
      expect(component.reservation).toEqual(mockReservationWithName);
      expect(component.hotel).toEqual(mockHotel);
      expect(component.loading).toBe(false);
    });

    it('muestra error si la reserva no existe', async () => {
      const { component } = await createComponent({ reservationError: true });
      expect(component.error).toBe('No se encontró la reserva.');
      expect(component.loading).toBe(false);
    });

    it('sigue cargando el componente aunque el hotel falle', async () => {
      const { component } = await createComponent({ hotelError: true });
      expect(component.reservation).toEqual(mockReservationWithName);
      expect(component.hotel).toBeNull();
      expect(component.loading).toBe(false);
    });
  });

  describe('nombre de habitación', () => {
    it('muestra habitacion_nombre cuando el API lo devuelve', async () => {
      const { fixture } = await createComponent({
        reservation: mockReservationWithName,
      });
      fixture.detectChanges();
      const html = fixture.nativeElement.innerHTML;
      expect(html).toContain('Suite Caribe');
      expect(html).not.toContain('Habitación #10');
    });

    it('muestra "Habitación #ID" como fallback cuando no hay nombre', async () => {
      const { fixture } = await createComponent({
        reservation: mockReservationWithoutName,
      });
      fixture.detectChanges();
      const html = fixture.nativeElement.innerHTML;
      expect(html).toContain('Habitación #15');
    });
  });

  describe('nights()', () => {
    it('calcula correctamente el número de noches', async () => {
      const { component } = await createComponent();
      expect(component.nights()).toBe(2);
    });

    it('devuelve 0 si no hay fechas', async () => {
      const { component } = await createComponent({
        reservation: {
          ...mockReservationWithName,
          fecha_checkin: undefined,
          fecha_checkout: undefined,
        },
      });
      expect(component.nights()).toBe(0);
    });

    it('devuelve 0 si checkout es anterior a checkin', async () => {
      const { component } = await createComponent({
        reservation: {
          ...mockReservationWithName,
          fecha_checkin: '2026-06-05',
          fecha_checkout: '2026-06-01',
        },
      });
      expect(component.nights()).toBe(0);
    });
  });

  describe('estadoClass()', () => {
    it('retorna clase verde para confirmada', async () => {
      const { component } = await createComponent();
      expect(component.estadoClass('confirmada')).toContain('green');
    });

    it('retorna clase azul para completada', async () => {
      const { component } = await createComponent();
      expect(component.estadoClass('completada')).toContain('blue');
    });

    it('retorna clase roja para cancelada', async () => {
      const { component } = await createComponent();
      expect(component.estadoClass('cancelada')).toContain('red');
    });

    it('retorna clase amarilla para pendiente', async () => {
      const { component } = await createComponent();
      expect(component.estadoClass('pendiente')).toContain('yellow');
    });

    it('retorna clase gris para estado desconocido', async () => {
      const { component } = await createComponent();
      expect(component.estadoClass('desconocido')).toContain('gray');
    });
  });

  describe('cancel()', () => {
    it('cancela la reserva y actualiza el estado', async () => {
      const cancelFn = vi.fn().mockReturnValue(of({}));
      const { component } = await createComponent({ cancelFn });
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      component.cancel();
      expect(cancelFn).toHaveBeenCalledWith(42);
      expect(component.reservation!.estado).toBe('cancelada');
      expect(component.cancelSuccess).toBe(true);
    });

    it('no cancela si el usuario no confirma', async () => {
      const cancelFn = vi.fn().mockReturnValue(of({}));
      const { component } = await createComponent({ cancelFn });
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      component.cancel();
      expect(cancelFn).not.toHaveBeenCalled();
    });

    it('no hace nada si no hay reserva cargada', async () => {
      const { component } = await createComponent();
      component.reservation = null;
      component.cancel();
      expect(component.canceling).toBe(false);
    });
  });

  describe('formatPrice()', () => {
    it('formatea el precio en COP', async () => {
      const { component } = await createComponent();
      const result = component.formatPrice(1000000);
      expect(result).toContain('1');
      expect(result).toContain('000');
    });
  });
});
