import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { HotelReservation, HotelStats, WeeklyOccupancy } from '../models';

export interface HotelReservationFilters {
  search?: string;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  per_page?: number;
}

export interface HotelReservationsResponse {
  total: number;
  reservations: HotelReservation[];
}

export interface HotelStatsResponse extends HotelStats {
  weekly_occupancy: WeeklyOccupancy[];
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private api: ApiService) {}

  getReservations(
    hotelId: number,
    filters: HotelReservationFilters = {},
  ): Observable<HotelReservation[]> {
    const params: Record<string, string | number> = {};
    if (filters.search) params['search'] = filters.search;
    if (filters.estado) params['estado'] = filters.estado;
    if (filters.fecha_desde) params['fecha_desde'] = filters.fecha_desde;
    if (filters.fecha_hasta) params['fecha_hasta'] = filters.fecha_hasta;
    if (filters.page) params['page'] = filters.page;
    if (filters.per_page) params['per_page'] = filters.per_page;
    return this.api.get<HotelReservation[]>(`/reservations/hotel/${hotelId}`, params);
  }

  getStats(hotelId: number): Observable<HotelStatsResponse> {
    return this.api.get<HotelStatsResponse>(`/reservations/hotel/${hotelId}/stats`);
  }

  cancelReservation(hotelId: number, reservationId: number): Observable<HotelReservation> {
    return this.api.patch<HotelReservation>(
      `/reservations/hotel/${hotelId}/reservations/${reservationId}/cancel`,
    );
  }
}
