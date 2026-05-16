import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { TariffsComponent } from './tariffs.component';
import { HotelService } from '../../core/services/hotel.service';
import { RoomService } from '../../core/services/room.service';
import { Hotel, Room } from '../../core/models';

const mockHotel: Hotel = {
  id: 1,
  admin_id: 10,
  nombre: 'Hotel Test',
  ciudad: 'Bogotá',
  pais: 'Colombia',
  estrellas: 4,
  activo: true,
};

const mockRooms: Room[] = [
  {
    id: 1,
    hotel_id: 1,
    nombre: 'Suite Principal',
    tipo: 'suite',
    capacidad: 2,
    disponible: true,
    precio_noche: 300000,
    moneda: 'COP',
  },
  {
    id: 2,
    hotel_id: 1,
    nombre: 'Habitación Doble',
    tipo: 'doble',
    capacidad: 2,
    disponible: true,
    precio_noche: 180000,
    moneda: 'COP',
  },
];

async function createComponent(
  overrides: {
    hotel?: Hotel | null;
    rooms?: Room[];
    roomsError?: boolean;
    hotelError?: boolean;
  } = {},
) {
  const listFn = overrides.roomsError
    ? vi.fn().mockReturnValue(throwError(() => ({ error: { error: 'Server error' } })))
    : vi.fn().mockReturnValue(of(overrides.rooms ?? mockRooms));

  const loadMyHotelFn = overrides.hotelError
    ? vi.fn().mockReturnValue(throwError(() => new Error('Hotel not found')))
    : vi.fn().mockReturnValue(of(mockHotel));

  const updateFn = vi.fn();

  const hotelSignal = vi
    .fn()
    .mockReturnValue(overrides.hotel !== undefined ? overrides.hotel : mockHotel);

  const mockHotelService = {
    hotel: hotelSignal,
    loadMyHotel: loadMyHotelFn,
  };

  const mockRoomService = {
    list: listFn,
    update: updateFn,
  };

  await TestBed.configureTestingModule({
    imports: [TariffsComponent, RouterTestingModule],
    providers: [
      { provide: HotelService, useValue: mockHotelService },
      { provide: RoomService, useValue: mockRoomService },
      provideHttpClient(),
      provideTranslateService({ fallbackLang: 'es' }),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(TariffsComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, listFn, loadMyHotelFn, updateFn };
}

describe('TariffsComponent', () => {
  describe('ngOnInit() — hotel ya en el signal', () => {
    it('debe cargar habitaciones y poblar rows', async () => {
      const { component } = await createComponent();
      expect(component.rows.length).toBe(2);
      expect(component.rows[0].nombre).toBe('Suite Principal');
      expect(component.rows[0].newPrice).toBe('300000');
      expect(component.rows[0].saving).toBe(false);
      expect(component.rows[0].saved).toBe(false);
      expect(component.rows[0].saveError).toBe('');
    });

    it('debe desactivar loading al completar', async () => {
      const { component } = await createComponent();
      expect(component.loading).toBe(false);
    });

    it('no debe llamar loadMyHotel si hotel ya está en el signal', async () => {
      const { loadMyHotelFn } = await createComponent();
      expect(loadMyHotelFn).not.toHaveBeenCalled();
    });

    it('debe llamar roomService.list con el hotel_id correcto', async () => {
      const { listFn } = await createComponent();
      expect(listFn).toHaveBeenCalledWith(1);
    });
  });

  describe('ngOnInit() — hotel NO está en el signal', () => {
    it('debe llamar loadMyHotel y luego roomService.list', async () => {
      const { loadMyHotelFn, listFn } = await createComponent({ hotel: null });
      expect(loadMyHotelFn).toHaveBeenCalled();
      expect(listFn).toHaveBeenCalledWith(mockHotel.id);
    });

    it('debe poblar rows correctamente tras loadMyHotel', async () => {
      const { component } = await createComponent({ hotel: null });
      expect(component.rows.length).toBe(2);
      expect(component.loading).toBe(false);
    });
  });

  describe('ngOnInit() — habitaciones vacías', () => {
    it('debe mostrar rows vacío y loading=false', async () => {
      const { component } = await createComponent({ rooms: [] });
      expect(component.rows).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.loadError).toBe('');
    });
  });

  describe('ngOnInit() — error al cargar habitaciones', () => {
    it('debe setear loadError y desactivar loading', async () => {
      const { component } = await createComponent({ roomsError: true });
      expect(component.loading).toBe(false);
      expect(component.loadError).toBe('TARIFFS.ERR_LOAD');
      expect(component.rows).toEqual([]);
    });
  });

  describe('updateTariff()', () => {
    it('debe setear saveError si el precio es 0', async () => {
      const { component } = await createComponent();
      component.rows[0].newPrice = '0';
      component.updateTariff(component.rows[0]);
      expect(component.rows[0].saveError).toBe('TARIFFS.ERR_INVALID_PRICE');
      expect(component.rows[0].saving).toBe(false);
    });

    it('debe setear saveError si el precio es negativo', async () => {
      const { component } = await createComponent();
      component.rows[0].newPrice = '-100';
      component.updateTariff(component.rows[0]);
      expect(component.rows[0].saveError).toBe('TARIFFS.ERR_INVALID_PRICE');
    });

    it('debe setear saveError si el precio no es un número', async () => {
      const { component } = await createComponent();
      component.rows[0].newPrice = 'abc';
      component.updateTariff(component.rows[0]);
      expect(component.rows[0].saveError).toBe('TARIFFS.ERR_INVALID_PRICE');
    });

    it('debe setear saveError si el precio tiene decimales', async () => {
      const { component } = await createComponent();
      component.rows[0].newPrice = '350000.5';
      component.updateTariff(component.rows[0]);
      expect(component.rows[0].saveError).toBe('TARIFFS.ERR_INTEGER_PRICE');
      expect(component.rows[0].saving).toBe(false);
    });

    it('debe llamar roomService.update con roomId y precio entero', async () => {
      const updatedRoom = { ...mockRooms[0], precio_noche: 400000 };
      const { component, updateFn } = await createComponent();
      updateFn.mockReturnValue(of(updatedRoom));

      component.rows[0].newPrice = '400000';
      component.updateTariff(component.rows[0]);

      expect(updateFn).toHaveBeenCalledWith(1, { precio_noche: 400000 });
    });

    it('no debe llamar update si el precio es entero válido sin decimales', async () => {
      const updatedRoom = { ...mockRooms[0], precio_noche: 400000 };
      const { component, updateFn } = await createComponent();
      updateFn.mockReturnValue(of(updatedRoom));

      component.rows[0].newPrice = '400000';
      component.updateTariff(component.rows[0]);

      expect(updateFn).toHaveBeenCalledWith(1, { precio_noche: 400000 });
      expect(component.rows[0].saveError).toBe('');
    });

    it('debe actualizar precio_noche y newPrice en el row tras éxito', async () => {
      const updatedRoom = { ...mockRooms[0], precio_noche: 400000 };
      const { component, updateFn } = await createComponent();
      updateFn.mockReturnValue(of(updatedRoom));

      component.rows[0].newPrice = '400000';
      component.updateTariff(component.rows[0]);

      expect(component.rows[0].precio_noche).toBe(400000);
      expect(component.rows[0].newPrice).toBe('400000');
      expect(component.rows[0].saved).toBe(true);
      expect(component.rows[0].saving).toBe(false);
    });

    it('debe limpiar saved=true después de 3 segundos', async () => {
      vi.useFakeTimers();
      const updatedRoom = { ...mockRooms[0], precio_noche: 400000 };
      const { component, updateFn } = await createComponent();
      updateFn.mockReturnValue(of(updatedRoom));

      component.rows[0].newPrice = '400000';
      component.updateTariff(component.rows[0]);
      expect(component.rows[0].saved).toBe(true);

      vi.advanceTimersByTime(3000);
      expect(component.rows[0].saved).toBe(false);
      vi.useRealTimers();
    });

    it('debe setear saveError si el servidor devuelve error', async () => {
      const { component, updateFn } = await createComponent();
      updateFn.mockReturnValue(throwError(() => ({ error: { error: 'Room not found' } })));

      component.rows[0].newPrice = '400000';
      component.updateTariff(component.rows[0]);

      expect(component.rows[0].saving).toBe(false);
      expect(component.rows[0].saveError).toBe('TARIFFS.ERR_UPDATE');
    });

    it('debe usar mensaje genérico si el error no tiene detalle', async () => {
      const { component, updateFn } = await createComponent();
      updateFn.mockReturnValue(throwError(() => ({})));

      component.rows[0].newPrice = '400000';
      component.updateTariff(component.rows[0]);

      expect(component.rows[0].saveError).toBe('TARIFFS.ERR_UPDATE');
    });
  });

  describe('formatPrice()', () => {
    it('debe formatear un número como moneda COP', async () => {
      const { component } = await createComponent();
      const result = component.formatPrice(300000);
      expect(result).toContain('300');
    });
  });
});
