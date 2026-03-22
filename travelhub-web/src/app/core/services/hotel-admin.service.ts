import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HotelDetail, CreateHotelRequest, Room, CreateRoomRequest, Reservation } from '../models';

@Injectable({ providedIn: 'root' })
export class HotelAdminService {
  constructor(private api: ApiService) {}

  getMyHotel(): Observable<HotelDetail> {
    return this.api.get<HotelDetail>('/catalog/hotels/mine');
  }

  createHotel(data: CreateHotelRequest): Observable<HotelDetail> {
    return this.api.post<HotelDetail>('/catalog/hotels', data);
  }

  updateHotel(id: number, data: Partial<HotelDetail>): Observable<HotelDetail> {
    return this.api.put<HotelDetail>(`/catalog/hotels/${id}`, data);
  }

  getRooms(hotelId: number): Observable<Room[]> {
    return this.api.get<Room[]>('/catalog/rooms');
  }

  createRoom(data: CreateRoomRequest): Observable<Room> {
    return this.api.post<Room>('/catalog/rooms', data);
  }

  updateRoom(id: number, data: Partial<Room>): Observable<Room> {
    return this.api.put<Room>(`/catalog/rooms/${id}`, data);
  }

  deleteRoom(id: number): Observable<any> {
    return this.api.delete(`/catalog/rooms/${id}`);
  }

  getHotelReservations(hotelId: number, params: Record<string, string> = {}): Observable<Reservation[]> {
    const query: Record<string, string | number> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v) query[k] = v;
    });
    return this.api.get<Reservation[]>(`/reservations/hotel/${hotelId}`, query);
  }
}
