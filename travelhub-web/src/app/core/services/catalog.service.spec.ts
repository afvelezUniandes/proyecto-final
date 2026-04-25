import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CatalogService } from './catalog.service';
import { ApiService } from './api.service';
import { Hotel, HotelsResponse, Room, OccupiedRoomsResponse } from '../models';

describe('CatalogService', () => {
  let service: CatalogService;
  let apiGetFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiGetFn = vi.fn();
    const mockApiService = { get: apiGetFn };

    TestBed.configureTestingModule({
      providers: [CatalogService, { provide: ApiService, useValue: mockApiService }],
    });
    service = TestBed.inject(CatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCities()', () => {
    it('should call GET /catalog/cities', () => {
      apiGetFn.mockReturnValue(of(['Bogotá', 'Medellín']));
      service.getCities().subscribe((cities) => {
        expect(cities).toEqual(['Bogotá', 'Medellín']);
      });
      expect(apiGetFn).toHaveBeenCalledWith('/catalog/cities');
    });
  });

  describe('getHotel()', () => {
    it('should call GET /catalog/hotels/:id directly', () => {
      const mockHotel: Hotel = {
        id: 1,
        nombre: 'Hotel Test',
        ciudad: 'Bogotá',
        pais: 'Colombia',
        estrellas: 4,
        activo: true,
        descripcion: 'Un hotel de prueba',
        direccion: 'Calle 1 # 1-1',
        image_url: 'https://s3.amazonaws.com/hotels/foto.jpg',
      };
      apiGetFn.mockReturnValue(of(mockHotel));

      service.getHotel(1).subscribe((hotel) => {
        expect(hotel).toEqual(mockHotel);
        expect(hotel.id).toBe(1);
      });

      expect(apiGetFn).toHaveBeenCalledWith('/catalog/hotels/1');
    });
  });

  describe('getHotels()', () => {
    it('should call GET /catalog/hotels with ciudad filter', () => {
      const mockResponse: HotelsResponse = {
        total: 1,
        page: 1,
        per_page: 10,
        hotels: [
          {
            id: 1,
            nombre: 'Hotel Bogotá',
            ciudad: 'Bogotá',
            pais: 'Colombia',
            estrellas: 3,
            activo: true,
          },
        ],
      };
      apiGetFn.mockReturnValue(of(mockResponse));

      service.getHotels({ ciudad: 'Bogotá' }).subscribe((res) => {
        expect(res.hotels.length).toBe(1);
        expect(res.hotels[0].ciudad).toBe('Bogotá');
      });

      expect(apiGetFn).toHaveBeenCalledWith(
        '/catalog/hotels',
        expect.objectContaining({ ciudad: 'Bogotá' }),
      );
    });
  });

  describe('getRooms()', () => {
    it('should call GET /catalog/rooms with hotel_id param', () => {
      const mockRooms: Room[] = [
        {
          id: 1,
          hotel_id: 5,
          nombre: 'Suite 101',
          tipo: 'suite',
          capacidad: 2,
          disponible: true,
          precio_noche: 200,
          moneda: 'COP',
        },
      ];
      apiGetFn.mockReturnValue(of(mockRooms));

      service.getRooms(5).subscribe((rooms) => {
        expect(rooms.length).toBe(1);
        expect(rooms[0].hotel_id).toBe(5);
      });

      expect(apiGetFn).toHaveBeenCalledWith(
        '/catalog/rooms',
        expect.objectContaining({ hotel_id: 5 }),
      );
    });
  });

  describe('getOccupiedRooms()', () => {
    it('should call GET /reservations/occupied-rooms with params', () => {
      const mockResponse: OccupiedRoomsResponse = { occupied_room_ids: [1, 2] };
      apiGetFn.mockReturnValue(of(mockResponse));

      service.getOccupiedRooms(5, '2026-05-01', '2026-05-05').subscribe((res) => {
        expect(res.occupied_room_ids).toEqual([1, 2]);
      });

      expect(apiGetFn).toHaveBeenCalledWith(
        '/reservations/occupied-rooms',
        expect.objectContaining({
          hotel_id: 5,
          fecha_checkin: '2026-05-01',
          fecha_checkout: '2026-05-05',
        }),
      );
    });
  });
});
