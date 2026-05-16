import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Room } from '../models';

export interface CreateRoomPayload {
  hotel_id: number;
  nombre: string;
  tipo: string;
  capacidad: number;
  precio_noche: number;
  moneda?: string;
  disponible?: boolean;
  descripcion?: string;
}

export type UpdateRoomPayload = Partial<Omit<CreateRoomPayload, 'hotel_id'>>;

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor(private api: ApiService) {}

  list(hotelId: number): Observable<Room[]> {
    return this.api.get<Room[]>('/catalog/rooms', { hotel_id: hotelId });
  }

  listAll(hotelId: number): Observable<Room[]> {
    return this.api.get<Room[]>('/catalog/rooms', { hotel_id: hotelId, include_deleted: 'true' });
  }

  create(payload: CreateRoomPayload): Observable<Room> {
    return this.api.post<Room>('/catalog/rooms', payload);
  }

  update(id: number, payload: UpdateRoomPayload): Observable<Room> {
    return this.api.put<Room>(`/catalog/rooms/${id}`, payload);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/catalog/rooms/${id}`);
  }

  restore(id: number): Observable<Room> {
    return this.api.patch<Room>(`/catalog/rooms/${id}/restore`);
  }
}
