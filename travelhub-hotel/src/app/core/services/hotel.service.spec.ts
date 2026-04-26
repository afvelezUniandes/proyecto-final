import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { HotelService } from './hotel.service';
import { ApiService } from './api.service';
import { Hotel, Room } from '../models/index';

describe('HotelService', () => {
  let service: HotelService;
  let apiGetFn: ReturnType<typeof vi.fn>;
  let apiPutFn: ReturnType<typeof vi.fn>;
  let apiUploadFileFn: ReturnType<typeof vi.fn>;

  const mockHotel: Hotel = {
    id: 1,
    admin_id: 10,
    nombre: 'Hotel Test',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    estrellas: 4,
    activo: true,
    image_url: 'https://s3.amazonaws.com/hotels/foto.jpg',
  };

  beforeEach(() => {
    apiGetFn = vi.fn();
    apiPutFn = vi.fn();
    apiUploadFileFn = vi.fn();

    const mockApiService = {
      get: apiGetFn,
      put: apiPutFn,
      uploadFile: apiUploadFileFn,
    };

    TestBed.configureTestingModule({
      providers: [HotelService, { provide: ApiService, useValue: mockApiService }],
    });
    service = TestBed.inject(HotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('hotel signal starts as null', () => {
    expect(service.hotel()).toBeNull();
  });

  describe('loadMyHotel()', () => {
    it('should call GET /catalog/hotels/mine and update signal', () => {
      apiGetFn.mockReturnValue(of(mockHotel));

      service.loadMyHotel().subscribe((hotel) => {
        expect(hotel).toEqual(mockHotel);
      });

      expect(apiGetFn).toHaveBeenCalledWith('/catalog/hotels/mine');
      expect(service.hotel()).toEqual(mockHotel);
    });
  });

  describe('uploadImage()', () => {
    it('should call uploadFile and update signal image_url', () => {
      const newUrl = 'https://s3.amazonaws.com/hotels/nueva.jpg';
      apiGetFn.mockReturnValue(of(mockHotel));
      apiUploadFileFn.mockReturnValue(of({ image_url: newUrl }));

      service.loadMyHotel().subscribe();
      service
        .uploadImage(1, new File([''], 'foto.jpg', { type: 'image/jpeg' }))
        .subscribe((res) => {
          expect(res.image_url).toBe(newUrl);
        });

      expect(apiUploadFileFn).toHaveBeenCalledWith('/catalog/hotels/1/image', expect.any(File));
      expect(service.hotel()?.image_url).toBe(newUrl);
    });
  });

  describe('setImageUrl()', () => {
    it('should call PUT /catalog/hotels/:id and update signal', () => {
      const updatedHotel = { ...mockHotel, image_url: 'https://s3.amazonaws.com/hotels/otra.jpg' };
      apiGetFn.mockReturnValue(of(mockHotel));
      apiPutFn.mockReturnValue(of(updatedHotel));

      service.loadMyHotel().subscribe();
      service.setImageUrl(1, 'https://s3.amazonaws.com/hotels/otra.jpg').subscribe((hotel) => {
        expect(hotel.image_url).toBe('https://s3.amazonaws.com/hotels/otra.jpg');
      });

      expect(apiPutFn).toHaveBeenCalledWith('/catalog/hotels/1', {
        image_url: 'https://s3.amazonaws.com/hotels/otra.jpg',
      });
      expect(service.hotel()?.image_url).toBe('https://s3.amazonaws.com/hotels/otra.jpg');
    });
  });

  describe('getRooms()', () => {
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

    it('should call GET /catalog/rooms with hotel_id param', () => {
      apiGetFn.mockReturnValue(of(mockRooms));

      service.getRooms(1).subscribe((rooms) => {
        expect(rooms).toEqual(mockRooms);
      });

      expect(apiGetFn).toHaveBeenCalledWith('/catalog/rooms', { hotel_id: 1 });
    });

    it('should return empty array when hotel has no rooms', () => {
      apiGetFn.mockReturnValue(of([]));

      service.getRooms(99).subscribe((rooms) => {
        expect(rooms).toEqual([]);
        expect(rooms.length).toBe(0);
      });

      expect(apiGetFn).toHaveBeenCalledWith('/catalog/rooms', { hotel_id: 99 });
    });
  });

  describe('updateRoom()', () => {
    const mockRoom: Room = {
      id: 5,
      hotel_id: 1,
      nombre: 'Suite Ejecutiva',
      tipo: 'suite',
      capacidad: 3,
      disponible: true,
      precio_noche: 450000,
      moneda: 'COP',
    };

    it('should call PUT /catalog/rooms/:id with the provided data', () => {
      const updatedRoom = { ...mockRoom, precio_noche: 500000 };
      apiPutFn.mockReturnValue(of(updatedRoom));

      service.updateRoom(5, { precio_noche: 500000 }).subscribe((room) => {
        expect(room.precio_noche).toBe(500000);
      });

      expect(apiPutFn).toHaveBeenCalledWith('/catalog/rooms/5', { precio_noche: 500000 });
    });

    it('should return the full updated room from the backend', () => {
      const updatedRoom = { ...mockRoom, nombre: 'Suite Premium', capacidad: 4 };
      apiPutFn.mockReturnValue(of(updatedRoom));

      service.updateRoom(5, { nombre: 'Suite Premium', capacidad: 4 }).subscribe((room) => {
        expect(room).toEqual(updatedRoom);
        expect(room.nombre).toBe('Suite Premium');
        expect(room.capacidad).toBe(4);
      });
    });
  });
});
