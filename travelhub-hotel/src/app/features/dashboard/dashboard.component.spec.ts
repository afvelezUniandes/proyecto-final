import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { DashboardComponent } from './dashboard.component';
import { HotelService } from '../../core/services/hotel.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Hotel, HotelReservation, WeeklyOccupancy } from '../../core/models';

const mockHotel: Hotel = {
  id: 1,
  nombre: 'Hotel Test',
  ciudad: 'Bogotá',
  pais: 'Colombia',
  estrellas: 4,
  activo: true,
};

const mockStats = {
  reservas_activas: 3,
  reservas_activas_delta: 1,
  tasa_ocupacion: 75,
  tasa_ocupacion_delta: 5,
  ingresos_mes: 5000000,
  ingresos_mes_delta: 10,
  calificacion_promedio: 4.5,
  total_resenas: 20,
  weekly_occupancy: [],
};

const mockReservationWithName: HotelReservation = {
  id: 1,
  codigo: 'TH-001',
  habitacion_id: 10,
  habitacion_nombre: 'Suite Presidencial',
  hotel_id: 1,
  fecha_checkin: '2026-06-01',
  fecha_checkout: '2026-06-03',
  num_huespedes: 2,
  fecha_creacion: '2026-05-01',
  monto_total: 1000000,
  moneda: 'COP',
  estado: 'confirmada',
  huesped_nombre: 'Juan Pérez',
};

const mockReservationWithoutName: HotelReservation = {
  id: 2,
  codigo: 'TH-002',
  habitacion_id: 14,
  hotel_id: 1,
  fecha_checkin: '2026-07-01',
  fecha_checkout: '2026-07-02',
  num_huespedes: 1,
  fecha_creacion: '2026-05-01',
  monto_total: 200000,
  moneda: 'COP',
  estado: 'confirmada',
  huesped_nombre: 'María López',
};

async function createComponent(
  overrides: {
    reservations?: HotelReservation[];
    loadError?: boolean;
  } = {},
) {
  const reservations = overrides.reservations ?? [mockReservationWithName];

  const mockHotelService = {
    hotel: vi.fn().mockReturnValue(mockHotel),
    loadMyHotel: vi.fn().mockReturnValue(of(mockHotel)),
    uploadImage: vi.fn().mockReturnValue(of({ image_url: 'http://example.com/img.jpg' })),
  };

  const mockReservationService = {
    getStats: overrides.loadError
      ? vi.fn().mockReturnValue(throwError(() => new Error('error')))
      : vi.fn().mockReturnValue(of(mockStats)),
    getReservations: overrides.loadError
      ? vi.fn().mockReturnValue(throwError(() => new Error('error')))
      : vi.fn().mockReturnValue(of(reservations)),
  };

  await TestBed.configureTestingModule({
    imports: [DashboardComponent],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideTranslateService({ fallbackLang: 'es' }),
      { provide: HotelService, useValue: mockHotelService },
      { provide: ReservationService, useValue: mockReservationService },
    ],
  }).compileComponents();

  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('es', {
    DASHBOARD: {
      ERR_LOAD: 'Error al cargar el dashboard.',
      COL_ROOM: 'Habitación',
    },
    RESERVATIONS: { ROOM_PREFIX: 'Habitación #' },
  });
  translate.use('es');

  const fixture = TestBed.createComponent(DashboardComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component };
}

describe('DashboardComponent', () => {
  it('debe crearse correctamente', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - carga de datos', () => {
    it('carga reservas recientes y stats al iniciar', async () => {
      const { component } = await createComponent();
      expect(component.loading()).toBe(false);
      expect(component.recentReservations().length).toBe(1);
      expect(component.stats()).not.toBeNull();
    });

    it('muestra error si falla la carga', async () => {
      const { component } = await createComponent({ loadError: true });
      expect(component.loading()).toBe(false);
      expect(component.loadError()).toBe('DASHBOARD.ERR_LOAD');
    });

    it('muestra solo las 5 reservas más recientes', async () => {
      const many = Array.from({ length: 8 }, (_, i) => ({
        ...mockReservationWithName,
        id: i + 1,
        codigo: `TH-00${i + 1}`,
      }));
      const { component } = await createComponent({ reservations: many });
      expect(component.recentReservations().length).toBe(5);
    });
  });

  describe('nombre de habitación en tabla', () => {
    it('muestra habitacion_nombre cuando está disponible', async () => {
      const { fixture } = await createComponent({
        reservations: [mockReservationWithName],
      });
      fixture.detectChanges();
      const html = fixture.nativeElement.innerHTML;
      expect(html).toContain('Suite Presidencial');
      expect(html).not.toContain('Habitación #10');
    });

    it('muestra "Habitación #ID" como fallback cuando la habitación fue eliminada', async () => {
      const { fixture } = await createComponent({
        reservations: [mockReservationWithoutName],
      });
      fixture.detectChanges();
      const html = fixture.nativeElement.innerHTML;
      expect(html).toContain('Habitación #14');
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

    it('retorna clase gris para estado desconocido', async () => {
      const { component } = await createComponent();
      expect(component.estadoClass('pendiente')).toContain('gray');
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

  describe('barHeightPx()', () => {
    it('retorna mínimo 3px cuando el valor es 0', async () => {
      const { component } = await createComponent();
      expect(component.barHeightPx(0)).toBe(3);
    });

    it('retorna 88px para el valor máximo', async () => {
      const { component } = await createComponent();
      component.weeklyOccupancy.set([
        { dia: 'Lun', dia_num: 1, mes_num: 5, porcentaje: 100, es_hoy: false },
      ]);
      expect(component.barHeightPx(100)).toBe(88);
    });
  });
});
