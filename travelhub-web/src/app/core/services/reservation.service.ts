import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Reservation, CreateReservationRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private api: ApiService) {}

  getReservations(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>('/reservations');
  }

  getReservation(id: number): Observable<Reservation> {
    return this.api.get<Reservation>(`/reservations/${id}`);
  }

  createReservation(req: CreateReservationRequest): Observable<Reservation> {
    return this.api.post<Reservation>('/reservations', req);
  }

  cancelReservation(id: number): Observable<{ message: string }> {
    return this.api.patch<{ message: string }>(`/reservations/${id}/cancel`);
  }
}
