import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Hotel, HotelsResponse, Room, OccupiedRoomsResponse } from '../models';

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
      fechaCheckin?: string;
      fechaCheckout?: string;
      capacidad?: number;
      page?: number;
      per_page?: number;
    } = {},
  ): Observable<HotelsResponse> {
    const query: Record<string, string | number> = {};
    if (params.ciudad) query['ciudad'] = params.ciudad;
    if (params.nombre) query['nombre'] = params.nombre;
    if (params.estrellas) query['estrellas'] = params.estrellas;
    if (params.fechaCheckin) query['fecha_checkin'] = params.fechaCheckin;
    if (params.fechaCheckout) query['fecha_checkout'] = params.fechaCheckout;
    if (params.capacidad) query['capacidad'] = params.capacidad;
    if (params.page) query['page'] = params.page;
    if (params.per_page) query['per_page'] = params.per_page;
    return this.api.get<HotelsResponse>('/catalog/hotels', query);
  }

  getHotel(id: number): Observable<Hotel> {
    return this.api.get<Hotel>(`/catalog/hotels/${id}`);
  }

  getRooms(hotelId: number): Observable<Room[]> {
    return this.api.get<Room[]>('/catalog/rooms', { hotel_id: hotelId });
  }

  getOccupiedRooms(
    hotelId: number,
    fechaCheckin: string,
    fechaCheckout: string,
  ): Observable<OccupiedRoomsResponse> {
    return this.api.get<OccupiedRoomsResponse>('/reservations/occupied-rooms', {
      hotel_id: hotelId,
      fecha_checkin: fechaCheckin,
      fecha_checkout: fechaCheckout,
    });
  }
}
