import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { Reservation, CreateReservationRequest } from '../models';

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1001,
    habitacion_id: 201,
    hotel_id: 2,
    fecha_inicio: '2026-04-10',
    fecha_fin: '2026-04-14',
    fecha_checkin: '2026-04-10',
    fecha_checkout: '2026-04-14',
    adultos: 2,
    ninos: 0,
    fecha_creacion: '2026-03-01T10:30:00Z',
    codigo: 'TH-1001',
    monto_total: 2320000,
    moneda: 'COP',
    estado: 'confirmada',
  },
  {
    id: 1002,
    habitacion_id: 501,
    hotel_id: 5,
    fecha_inicio: '2026-05-20',
    fecha_fin: '2026-05-25',
    fecha_checkin: '2026-05-20',
    fecha_checkout: '2026-05-25',
    adultos: 2,
    ninos: 1,
    fecha_creacion: '2026-03-05T14:15:00Z',
    codigo: 'TH-1002',
    monto_total: 1900000,
    moneda: 'COP',
    estado: 'pendiente',
  },
  {
    id: 1003,
    habitacion_id: 401,
    hotel_id: 4,
    fecha_inicio: '2026-01-15',
    fecha_fin: '2026-01-18',
    fecha_checkin: '2026-01-15',
    fecha_checkout: '2026-01-18',
    adultos: 2,
    ninos: 0,
    fecha_creacion: '2026-01-02T09:00:00Z',
    codigo: 'TH-1003',
    monto_total: 1470000,
    moneda: 'COP',
    estado: 'completada',
  },
  {
    id: 1004,
    habitacion_id: 601,
    hotel_id: 6,
    fecha_inicio: '2026-02-08',
    fecha_fin: '2026-02-10',
    fecha_checkin: '2026-02-08',
    fecha_checkout: '2026-02-10',
    adultos: 2,
    ninos: 0,
    fecha_creacion: '2026-01-20T16:45:00Z',
    codigo: 'TH-1004',
    monto_total: 1780000,
    moneda: 'COP',
    estado: 'cancelada',
  },
];

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private mockData = MOCK_RESERVATIONS.map((r) => ({ ...r }));

  constructor(private api: ApiService) {}

  getReservations(): Observable<Reservation[]> {
    return of([...this.mockData]);
  }

  getReservation(id: number): Observable<Reservation> {
    const r = this.mockData.find((x) => x.id === id);
    return of(r ?? this.mockData[0]);
  }

  createReservation(req: CreateReservationRequest): Observable<Reservation> {
    const newRes: Reservation = {
      id: Date.now(),
      habitacion_id: req.habitacion_id,
      hotel_id: req.hotel_id,
      fecha_inicio: req.fecha_inicio ?? req.fecha_checkin,
      fecha_fin: req.fecha_fin ?? req.fecha_checkout,
      fecha_checkin: req.fecha_checkin ?? req.fecha_inicio,
      fecha_checkout: req.fecha_checkout ?? req.fecha_fin,
      adultos: req.adultos ?? 1,
      ninos: req.ninos ?? 0,
      fecha_creacion: new Date().toISOString(),
      codigo: `TH-${Date.now().toString().slice(-4)}`,
      monto_total: req.monto_total,
      moneda: req.moneda ?? 'COP',
      estado: 'confirmada',
    };
    this.mockData.push(newRes);
    return of(newRes);
  }

  cancelReservation(id: number): Observable<{ message: string }> {
    const r = this.mockData.find((x) => x.id === id);
    if (r) r.estado = 'cancelada';
    return of({ message: 'Reserva cancelada' });
  }
}
