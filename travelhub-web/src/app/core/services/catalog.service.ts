import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Hotel, HotelsResponse, Room } from '../models';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private api: ApiService) {}

  getCities(): Observable<string[]> {
    return this.api.get<string[]>('/catalog/cities');
  }

  getHotels(
    params: {
      ciudad?: string;
      nombre?: string;
      estrellas?: number;
      page?: number;
      per_page?: number;
    } = {},
  ): Observable<HotelsResponse> {
    return this.api.get<HotelsResponse>(
      '/catalog/hotels',
      params as Record<string, string | number>,
    );
  }

  getHotel(id: number): Observable<Hotel> {
    return this.api.get<Hotel>(`/catalog/hotels/${id}`);
  }

  getRooms(hotelId: number): Observable<Room[]> {
    return this.api.get<Room[]>('/catalog/rooms', { hotel_id: hotelId });
  }
}
