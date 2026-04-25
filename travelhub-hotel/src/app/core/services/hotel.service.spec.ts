import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { HotelService } from './hotel.service';
import { ApiService } from './api.service';
import { Hotel } from '../models/index';

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
});
