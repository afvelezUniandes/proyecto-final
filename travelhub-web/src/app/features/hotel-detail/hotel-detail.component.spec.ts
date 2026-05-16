import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { HotelDetailComponent } from './hotel-detail.component';
import { CatalogService } from '../../core/services/catalog.service';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { Hotel, Room, Reservation } from '../../core/models';

registerLocaleData(localeEs);

const mockHotel: Hotel = {
  id: 1,
  nombre: 'Hotel Caribe',
  ciudad: 'Cartagena',
  pais: 'Colombia',
  estrellas: 5,
  activo: true,
};

const mockRooms: Room[] = [
  {
    id: 10,
    hotel_id: 1,
    nombre: 'Suite Caribe',
    tipo: 'suite',
    capacidad: 2,
    disponible: true,
    precio_noche: 500000,
    moneda: 'COP',
  },
  {
    id: 11,
    hotel_id: 1,
    nombre: 'Estándar',
    tipo: 'estandar',
    capacidad: 1,
    disponible: true,
    precio_noche: 200000,
    moneda: 'COP',
  },
];

const mockReservation: Reservation = {
  id: 99,
  habitacion_id: 10,
  hotel_id: 1,
  fecha_checkin: '2026-05-01',
  fecha_checkout: '2026-05-03',
  num_huespedes: 1,
  monto_total: 1000000,
  moneda: 'COP',
  estado: 'confirmada',
  codigo: 'TH-2026-4321',
};

async function createComponent(
  overrides: {
    isLoggedIn?: boolean;
    createReservationFn?: ReturnType<typeof vi.fn>;
    getOccupiedRoomsFn?: ReturnType<typeof vi.fn>;
    queryParams?: Record<string, string>;
  } = {},
) {
  const navigateFn = vi.fn();
  const createReservationFn =
    overrides.createReservationFn ?? vi.fn().mockReturnValue(of(mockReservation));
  const getOccupiedRoomsFn =
    overrides.getOccupiedRoomsFn ?? vi.fn().mockReturnValue(of({ occupied_room_ids: [] }));

  const mockCatalog = {
    getHotel: vi.fn().mockReturnValue(of(mockHotel)),
    getRooms: vi.fn().mockReturnValue(of(mockRooms)),
    getOccupiedRooms: getOccupiedRoomsFn,
  };

  const mockReservationService = {
    createReservation: createReservationFn,
  };

  const isLoggedInFn = vi.fn().mockReturnValue(overrides.isLoggedIn ?? true);

  const mockAuthService = {
    isLoggedIn: isLoggedInFn,
  };

  const qp = overrides.queryParams ?? {
    checkIn: '2026-05-01',
    checkOut: '2026-05-03',
    huespedes: '1',
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: { get: (key: string) => (key === 'id' ? '1' : null) },
      queryParams: qp,
    },
  };

  await TestBed.configureTestingModule({
    imports: [HotelDetailComponent],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideTranslateService({ fallbackLang: 'es' }),
      { provide: LOCALE_ID, useValue: 'es' },
      { provide: CatalogService, useValue: mockCatalog },
      { provide: ReservationService, useValue: mockReservationService },
      { provide: AuthService, useValue: mockAuthService },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
    ],
  }).compileComponents();

  const translateService = TestBed.inject(TranslateService);
  translateService.setTranslation('es', {
    HOTEL_DETAIL: {
      NOT_FOUND: 'Hotel no encontrado.',
      SELECT_HINT: 'Selecciona habitación y fechas.',
      ROOM_UNAVAILABLE: 'La habitación seleccionada no está disponible para las fechas indicadas.',
      RESERVE_ERROR: 'Error al crear la reserva.',
    },
  });
  translateService.use('es');

  // Override router.navigate after compile
  const fixture = TestBed.createComponent(HotelDetailComponent);
  const component = fixture.componentInstance;
  (component as any).router = {
    navigate: navigateFn,
    url: '/hotel/1',
    createUrlTree: vi.fn().mockImplementation((commands: any[], options?: any) => ({
      _commands: commands,
      _queryParams: options?.queryParams,
    })),
    serializeUrl: vi.fn().mockImplementation((tree: any) => {
      const base = (tree._commands as any[]).join('/');
      const qs = tree._queryParams
        ? '?' +
          Object.entries(tree._queryParams)
            .map(([k, v]) => `${k}=${v}`)
            .join('&')
        : '';
      return base + qs;
    }),
  };
  fixture.detectChanges();

  return { fixture, component, navigateFn, createReservationFn, mockCatalog };
}

describe('HotelDetailComponent', () => {
  it('should create the component', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('loads hotel and rooms on init', async () => {
      const { component, mockCatalog } = await createComponent();
      expect(mockCatalog.getHotel).toHaveBeenCalledWith(1);
      expect(mockCatalog.getRooms).toHaveBeenCalledWith(1);
      expect(component.hotel).toEqual(mockHotel);
      expect(component.rooms.length).toBe(2);
      expect(component.loading).toBe(false);
    });

    it('sets checkIn, checkOut and adultos from queryParams', async () => {
      const { component } = await createComponent({
        queryParams: { checkIn: '2026-06-10', checkOut: '2026-06-12', huespedes: '3' },
      });
      expect(component.checkIn).toBe('2026-06-10');
      expect(component.checkOut).toBe('2026-06-12');
      expect(component.adultos).toBe(3);
    });

    it('sets loading=false and error on API failure', async () => {
      TestBed.resetTestingModule();
      const navigateFn = vi.fn();
      const mockCatalog = {
        getHotel: vi.fn().mockReturnValue(throwError(() => new Error('Not found'))),
        getRooms: vi.fn().mockReturnValue(throwError(() => new Error('Not found'))),
        getOccupiedRooms: vi.fn(),
      };
      await TestBed.configureTestingModule({
        imports: [HotelDetailComponent],
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideTranslateService({ fallbackLang: 'es' }),
          { provide: LOCALE_ID, useValue: 'es' },
          { provide: CatalogService, useValue: mockCatalog },
          { provide: ReservationService, useValue: { createReservation: vi.fn() } },
          { provide: AuthService, useValue: { isLoggedIn: vi.fn().mockReturnValue(true) } },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: { get: () => '1' },
                queryParams: {},
              },
            },
          },
        ],
      }).compileComponents();
      const translateSvc = TestBed.inject(TranslateService);
      translateSvc.setTranslation('es', { HOTEL_DETAIL: { NOT_FOUND: 'Hotel no encontrado.' } });
      translateSvc.use('es');
      const fixture = TestBed.createComponent(HotelDetailComponent);
      const component = fixture.componentInstance;
      (component as any).router = { navigate: navigateFn, url: '/hotel/1' };
      fixture.detectChanges();
      expect(component.loading).toBe(false);
      expect(component.error).toBe('Hotel no encontrado.');
    });

    it('auto-selects first available room', async () => {
      const { component } = await createComponent();
      expect(component.selectedRoomId).toBe(10);
    });

    it('marks occupied rooms as unavailable', async () => {
      const { component } = await createComponent({
        getOccupiedRoomsFn: vi.fn().mockReturnValue(of({ occupied_room_ids: [10] })),
      });
      const room10 = component.rooms.find((r) => r.id === 10);
      const room11 = component.rooms.find((r) => r.id === 11);
      expect(room10?.disponible).toBe(false);
      expect(room11?.disponible).toBe(true);
    });

    it('marks rooms with insufficient capacity as unavailable', async () => {
      const { component } = await createComponent({
        queryParams: { checkIn: '2026-05-01', checkOut: '2026-05-03', huespedes: '3' },
        getOccupiedRoomsFn: vi.fn().mockReturnValue(of({ occupied_room_ids: [] })),
      });
      // room 10: capacidad=2 < adultos=3 → false
      const room10 = component.rooms.find((r) => r.id === 10);
      // room 11: capacidad=1 < adultos=3 → false
      const room11 = component.rooms.find((r) => r.id === 11);
      expect(room10?.disponible).toBe(false);
      expect(room11?.disponible).toBe(false);
      expect(component.selectedRoomId).toBeNull();
    });
  });

  describe('nights()', () => {
    it('returns 0 when dates are empty', async () => {
      const { component } = await createComponent({ queryParams: {} });
      expect(component.nights()).toBe(0);
    });

    it('calculates correct number of nights', async () => {
      const { component } = await createComponent({
        queryParams: { checkIn: '2026-05-01', checkOut: '2026-05-04' },
      });
      expect(component.nights()).toBe(3);
    });
  });

  describe('total()', () => {
    it('returns 0 when no room selected', async () => {
      const { component } = await createComponent();
      component.selectedRoomId = null;
      expect(component.total()).toBe(0);
    });

    it('calculates precio_noche × nights', async () => {
      const { component } = await createComponent();
      component.selectedRoomId = 10; // precio_noche = 500000
      // checkIn 2026-05-01, checkOut 2026-05-03 → 2 noches
      expect(component.total()).toBe(1000000);
    });
  });

  describe('reserve()', () => {
    it('redirects to /login when not authenticated', async () => {
      const { component, navigateFn } = await createComponent({ isLoggedIn: false });
      component.reserve();
      expect(navigateFn).toHaveBeenCalledWith(
        ['/login'],
        expect.objectContaining({
          queryParams: expect.objectContaining({
            returnUrl: expect.stringContaining('/hotel/1'),
          }),
        }),
      );
    });

    it('sets reserveError when no room or dates selected', async () => {
      const { component } = await createComponent({ queryParams: {} });
      component.selectedRoomId = null;
      component.reserve();
      expect(component.reserveError).toBe('Selecciona habitación y fechas.');
    });

    it('sets isUnavailableError when selected room is occupied', async () => {
      const { component } = await createComponent({
        getOccupiedRoomsFn: vi.fn().mockReturnValue(of({ occupied_room_ids: [10] })),
      });
      component.selectedRoomId = 10;
      component.reserve();
      expect(component.reserveError).toBe(
        'La habitación seleccionada no está disponible para las fechas indicadas.',
      );
      expect(component.isUnavailableError).toBe(true);
    });

    it('calls createReservation with correct payload', async () => {
      const { component, createReservationFn } = await createComponent();
      component.selectedRoomId = 10;
      component.reserve();
      expect(createReservationFn).toHaveBeenCalledWith({
        habitacion_id: 10,
        hotel_id: 1,
        fecha_checkin: '2026-05-01',
        fecha_checkout: '2026-05-03',
        num_huespedes: 1,
        monto_total: 1000000,
        moneda: 'COP',
        nombre_hotel: 'Hotel Caribe',
        tipo_habitacion: 'suite',
      });
    });

    it('sets reserveSuccess=true and stores reservationCode on success', async () => {
      const { component } = await createComponent();
      component.selectedRoomId = 10;
      component.reserve();
      expect(component.reserveSuccess).toBe(true);
      expect(component.reservationCode).toBe('TH-2026-4321');
    });

    it('sets reserveError on API failure', async () => {
      const { component } = await createComponent({
        createReservationFn: vi
          .fn()
          .mockReturnValue(throwError(() => ({ error: { error: 'Reservation conflict' } }))),
      });
      component.selectedRoomId = 10;
      component.reserve();
      expect(component.reserveError).toBe('Reservation conflict');
      expect(component.reserving).toBe(false);
    });

    it('sets generic error message on unknown API failure', async () => {
      const { component } = await createComponent({
        createReservationFn: vi.fn().mockReturnValue(throwError(() => ({}))),
      });
      component.selectedRoomId = 10;
      component.reserve();
      expect(component.reserveError).toBe('Error al crear la reserva.');
    });
  });

  describe('formatPrice()', () => {
    it('formats number as COP currency', async () => {
      const { component } = await createComponent();
      const result = component.formatPrice(500000);
      expect(result).toContain('500');
    });
  });

  describe('stars()', () => {
    it('returns an array of filled stars', async () => {
      const { component } = await createComponent();
      expect(component.stars(3)).toEqual(['★', '★', '★']);
    });

    it('returns empty array for 0 stars', async () => {
      const { component } = await createComponent();
      expect(component.stars(0)).toEqual([]);
    });
  });
});
