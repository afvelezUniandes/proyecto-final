import '@angular/compiler';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ReservationsComponent } from './reservations.component';
import { HotelReservation } from '../../core/models';

const mockHotel = { id: 1, nombre: 'Hotel Test', ciudad: 'Bogotá', pais: 'Colombia' };

const makeReservation = (overrides: Partial<HotelReservation>): HotelReservation => ({
  id: 1,
  codigo: 'TH-2026-0001',
  fecha_checkin: '2026-03-01',
  fecha_checkout: '2026-03-05',
  num_huespedes: 2,
  fecha_creacion: '2026-02-01',
  monto_total: 500000,
  moneda: 'COP',
  estado: 'confirmada',
  huesped_nombre: 'Juan Díaz',
  huesped_email: 'juan@correo.com',
  habitacion_nombre: 'Suite Ejecutiva',
  ...overrides,
});

const mockReservations: HotelReservation[] = [
  makeReservation({ id: 1, codigo: 'TH-2026-0001', estado: 'confirmada', habitacion_nombre: 'Suite Ejecutiva', fecha_checkin: '2026-03-01', fecha_checkout: '2026-03-05' }),
  makeReservation({ id: 2, codigo: 'TH-2026-0002', estado: 'cancelada', habitacion_nombre: 'Doble', huesped_nombre: 'Ana López', fecha_checkin: '2026-04-10', fecha_checkout: '2026-04-15' }),
  makeReservation({ id: 3, codigo: 'TH-2026-0003', estado: 'completada', habitacion_nombre: 'Suite Ejecutiva', huesped_nombre: 'Carlos Ruiz', fecha_checkin: '2026-02-01', fecha_checkout: '2026-02-03' }),
];

function createComponent(overrides: {
  reservations?: HotelReservation[];
  reservationsError?: boolean;
} = {}) {
  const getReservationsFn = overrides.reservationsError
    ? vi.fn().mockReturnValue(throwError(() => new Error('Server error')))
    : vi.fn().mockReturnValue(of(overrides.reservations ?? mockReservations));

  const mockHotelService = { loadMyHotel: vi.fn().mockReturnValue(of(mockHotel)) };
  const mockReservationService = { getReservations: getReservationsFn };
  const mockRouter = { navigate: vi.fn() };
  const mockCdr = { detectChanges: vi.fn() };

  const component = new ReservationsComponent(
    mockHotelService as never,
    mockReservationService as never,
    mockRouter as never,
    mockCdr as never,
  );

  component.ngOnInit();

  return { component, getReservationsFn };
}

describe('ReservationsComponent', () => {
  describe('ngOnInit()', () => {
    it('debe cargar reservas y desactivar loading', () => {
      const { component } = createComponent();
      expect(component.loading).toBe(false);
      expect(component.allReservations.length).toBe(3);
    });

    it('debe poblar habitacionOptions a partir de las reservas', () => {
      const { component } = createComponent();
      expect(component.habitacionOptions).toContain('Suite Ejecutiva');
      expect(component.habitacionOptions).toContain('Doble');
      expect(component.habitacionOptions[0]).toBe('');
    });

    it('debe setear loadError y desactivar loading si falla la carga', () => {
      const { component } = createComponent({ reservationsError: true });
      expect(component.loading).toBe(false);
      expect(component.loadError).toBe('No se pudieron cargar las reservas.');
      expect(component.reservations.length).toBe(0);
    });

    it('debe llamar getReservations con el id del hotel', () => {
      const { getReservationsFn } = createComponent();
      expect(getReservationsFn).toHaveBeenCalledWith(mockHotel.id);
    });
  });

  describe('applyFilters() — búsqueda por texto', () => {
    it('debe filtrar por código de reserva', () => {
      const { component } = createComponent();
      component.searchQuery = 'TH-2026-0002';
      component.applyFilters();
      expect(component.reservations.length).toBe(1);
      expect(component.reservations[0].codigo).toBe('TH-2026-0002');
    });

    it('debe filtrar por nombre del huésped (case-insensitive)', () => {
      const { component } = createComponent();
      component.searchQuery = 'ana';
      component.applyFilters();
      expect(component.reservations.length).toBe(1);
      expect(component.reservations[0].huesped_nombre).toBe('Ana López');
    });

    it('debe retornar todos si searchQuery está vacío', () => {
      const { component } = createComponent();
      component.searchQuery = '';
      component.applyFilters();
      expect(component.total).toBe(3);
    });
  });

  describe('applyFilters() — filtro por estado', () => {
    it('debe filtrar reservas confirmadas', () => {
      const { component } = createComponent();
      component.estadoFilter = 'confirmada';
      component.applyFilters();
      expect(component.reservations.every((r) => r.estado === 'confirmada')).toBe(true);
    });

    it('debe filtrar reservas canceladas', () => {
      const { component } = createComponent();
      component.estadoFilter = 'cancelada';
      component.applyFilters();
      expect(component.reservations.every((r) => r.estado === 'cancelada')).toBe(true);
    });

    it('debe filtrar reservas completadas', () => {
      const { component } = createComponent();
      component.estadoFilter = 'completada';
      component.applyFilters();
      expect(component.reservations.every((r) => r.estado === 'completada')).toBe(true);
    });

    it('debe mostrar todas si estadoFilter está vacío', () => {
      const { component } = createComponent();
      component.estadoFilter = '';
      component.applyFilters();
      expect(component.total).toBe(3);
    });
  });

  describe('applyFilters() — filtro por habitación', () => {
    it('debe filtrar por tipo de habitación', () => {
      const { component } = createComponent();
      component.habitacionFilter = 'Doble';
      component.applyFilters();
      expect(component.reservations.length).toBe(1);
      expect(component.reservations[0].habitacion_nombre).toBe('Doble');
    });

    it('debe mostrar todas si habitacionFilter está vacío', () => {
      const { component } = createComponent();
      component.habitacionFilter = '';
      component.applyFilters();
      expect(component.total).toBe(3);
    });
  });

  describe('applyFilters() — filtro por rango de fechas', () => {
    it('debe filtrar reservas con checkin mayor o igual a fechaDesde', () => {
      const { component } = createComponent();
      component.fechaDesde = '2026-03-01';
      component.applyFilters();
      expect(component.reservations.every((r) => r.fecha_checkin >= '2026-03-01')).toBe(true);
      expect(component.total).toBe(2);
    });

    it('debe filtrar reservas con checkout menor o igual a fechaHasta', () => {
      const { component } = createComponent();
      component.fechaHasta = '2026-03-10';
      component.applyFilters();
      expect(component.reservations.every((r) => r.fecha_checkout <= '2026-03-10')).toBe(true);
    });

    it('debe aplicar ambos extremos del rango simultáneamente', () => {
      const { component } = createComponent();
      component.fechaDesde = '2026-03-01';
      component.fechaHasta = '2026-03-31';
      component.applyFilters();
      expect(component.total).toBe(1);
      expect(component.reservations[0].codigo).toBe('TH-2026-0001');
    });

    it('debe mostrar todas si fechaDesde y fechaHasta están vacíos', () => {
      const { component } = createComponent();
      component.fechaDesde = '';
      component.fechaHasta = '';
      component.applyFilters();
      expect(component.total).toBe(3);
    });
  });

  describe('applyFilters() — filtros combinados', () => {
    it('debe combinar búsqueda y estado', () => {
      const { component } = createComponent();
      component.searchQuery = 'juan';
      component.estadoFilter = 'confirmada';
      component.applyFilters();
      expect(component.reservations.length).toBe(1);
      expect(component.reservations[0].huesped_nombre).toBe('Juan Díaz');
    });

    it('debe retornar vacío si los filtros no coinciden con ninguna reserva', () => {
      const { component } = createComponent();
      component.searchQuery = 'Inexistente';
      component.applyFilters();
      expect(component.reservations.length).toBe(0);
      expect(component.total).toBe(0);
    });
  });

  describe('paginación', () => {
    it('pageSize debe ser 20', () => {
      const { component } = createComponent();
      expect(component.pageSize).toBe(20);
    });

    it('debe paginar correctamente — primera página limita a 20 registros', () => {
      const many = Array.from({ length: 25 }, (_, i) =>
        makeReservation({ id: i + 1, codigo: `TH-2026-${String(i + 1).padStart(4, '0')}` }),
      );
      const { component } = createComponent({ reservations: many });
      expect(component.page).toBe(1);
      expect(component.reservations.length).toBe(20);
      expect(component.total).toBe(25);
    });

    it('nextPage() debe avanzar de página y mostrar los registros restantes', () => {
      const many = Array.from({ length: 25 }, (_, i) =>
        makeReservation({ id: i + 1, codigo: `TH-2026-${String(i + 1).padStart(4, '0')}` }),
      );
      const { component } = createComponent({ reservations: many });
      component.nextPage();
      expect(component.page).toBe(2);
      expect(component.reservations.length).toBe(5);
    });

    it('prevPage() no debe bajar de página 1', () => {
      const { component } = createComponent();
      component.prevPage();
      expect(component.page).toBe(1);
    });

    it('totalPages() debe calcular el número correcto de páginas', () => {
      const many = Array.from({ length: 25 }, (_, i) =>
        makeReservation({ id: i + 1, codigo: `TH-2026-${String(i + 1).padStart(4, '0')}` }),
      );
      const { component } = createComponent({ reservations: many });
      expect(component.totalPages()).toBe(2);
    });

    it('load() debe resetear a la página 1 y aplicar filtros', () => {
      const many = Array.from({ length: 25 }, (_, i) =>
        makeReservation({ id: i + 1, codigo: `TH-2026-${String(i + 1).padStart(4, '0')}` }),
      );
      const { component } = createComponent({ reservations: many });
      component.nextPage();
      expect(component.page).toBe(2);
      component.load();
      expect(component.page).toBe(1);
    });
  });

  describe('resetFilters()', () => {
    it('debe limpiar todos los filtros y volver a la página 1', () => {
      const { component } = createComponent();
      component.searchQuery = 'juan';
      component.estadoFilter = 'confirmada';
      component.habitacionFilter = 'Suite Ejecutiva';
      component.fechaDesde = '2026-03-01';
      component.fechaHasta = '2026-03-31';
      component.page = 2;
      component.resetFilters();
      expect(component.searchQuery).toBe('');
      expect(component.estadoFilter).toBe('');
      expect(component.habitacionFilter).toBe('');
      expect(component.fechaDesde).toBe('');
      expect(component.fechaHasta).toBe('');
      expect(component.page).toBe(1);
      expect(component.total).toBe(3);
    });
  });

  describe('estadoClass()', () => {
    it('debe retornar clases verdes para confirmada', () => {
      const { component } = createComponent();
      expect(component.estadoClass('confirmada')).toContain('green');
    });

    it('debe retornar clases azules para completada', () => {
      const { component } = createComponent();
      expect(component.estadoClass('completada')).toContain('blue');
    });

    it('debe retornar clases rojas para cancelada', () => {
      const { component } = createComponent();
      expect(component.estadoClass('cancelada')).toContain('red');
    });

    it('debe retornar clases grises para estado desconocido', () => {
      const { component } = createComponent();
      expect(component.estadoClass('pendiente')).toContain('gray');
    });
  });
});
