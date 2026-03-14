import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HotelStats, HotelReservation, Room, WeeklyOccupancy, RevenueByRoom } from '../../models';

@Injectable({ providedIn: 'root' })
export class MockHotelAdminService {
  getStats(): Observable<HotelStats> {
    return of({
      reservas_activas: 47,
      reservas_activas_delta: 12,
      tasa_ocupacion: 78,
      tasa_ocupacion_delta: 5,
      ingresos_mes: 85200000,
      ingresos_mes_delta: 8,
      calificacion_promedio: 9.2,
      total_resenas: 328,
    });
  }

  getWeeklyOccupancy(): Observable<WeeklyOccupancy[]> {
    return of([
      { dia: 'Lun', porcentaje: 55 },
      { dia: 'Mar', porcentaje: 65 },
      { dia: 'Mié', porcentaje: 70 },
      { dia: 'Jue', porcentaje: 68 },
      { dia: 'Vie', porcentaje: 85 },
      { dia: 'Sáb', porcentaje: 92 },
      { dia: 'Dom', porcentaje: 78 },
    ]);
  }

  getRevenueByRoom(): Observable<RevenueByRoom[]> {
    return of([
      { tipo: 'Suite Premium', monto: 38500000 },
      { tipo: 'Suite Ejecutiva', monto: 28200000 },
      { tipo: 'Doble', monto: 12800000 },
      { tipo: 'Sencilla', monto: 5700000 },
    ]);
  }

  getReservations(
    filters: {
      search?: string;
      estado?: string;
      desde?: string;
      hasta?: string;
      habitacion?: string;
      page?: number;
      per_page?: number;
    } = {},
  ): Observable<{ total: number; reservations: HotelReservation[] }> {
    const all: HotelReservation[] = [
      {
        id: 842,
        codigo: 'TH-2026-0842',
        huesped_nombre: 'Juan Díaz',
        huesped_email: 'juan@correo.com',
        huesped_telefono: '+57 310 555 1234',
        huesped_pais: 'Colombia',
        huesped_idioma: 'Español',
        habitacion_nombre: 'Suite Ejecutiva',
        fecha_checkin: '2026-03-15',
        fecha_checkout: '2026-03-20',
        num_huespedes: 2,
        fecha_creacion: '2026-03-01T14:35:00',
        monto_total: 2250000,
        moneda: 'COP',
        estado: 'confirmada',
        precio_noche: 450000,
        noches: 5,
      },
      {
        id: 839,
        codigo: 'TH-2026-0839',
        huesped_nombre: 'Ana López',
        huesped_email: 'ana@correo.com',
        huesped_telefono: '+57 311 444 5678',
        huesped_pais: 'Colombia',
        huesped_idioma: 'Español',
        habitacion_nombre: 'Doble',
        fecha_checkin: '2026-03-12',
        fecha_checkout: '2026-03-15',
        num_huespedes: 2,
        fecha_creacion: '2026-02-28T10:20:00',
        monto_total: 1860000,
        moneda: 'COP',
        estado: 'confirmada',
        precio_noche: 620000,
        noches: 3,
      },
      {
        id: 835,
        codigo: 'TH-2026-0835',
        huesped_nombre: 'Carlos Ruiz',
        huesped_email: 'carlos@correo.com',
        huesped_telefono: '+57 312 333 9012',
        huesped_pais: 'Colombia',
        huesped_idioma: 'Español',
        habitacion_nombre: 'Sencilla',
        fecha_checkin: '2026-03-10',
        fecha_checkout: '2026-03-12',
        num_huespedes: 1,
        fecha_creacion: '2026-02-25T09:15:00',
        monto_total: 600000,
        moneda: 'COP',
        estado: 'completada',
        precio_noche: 300000,
        noches: 2,
      },
      {
        id: 830,
        codigo: 'TH-2026-0830',
        huesped_nombre: 'Luisa Martínez',
        huesped_email: 'luisa@correo.com',
        huesped_telefono: '+57 313 222 3456',
        huesped_pais: 'Colombia',
        huesped_idioma: 'Español',
        habitacion_nombre: 'Suite Premium',
        fecha_checkin: '2026-03-08',
        fecha_checkout: '2026-03-11',
        num_huespedes: 2,
        fecha_creacion: '2026-02-20T16:30:00',
        monto_total: 3200000,
        moneda: 'COP',
        estado: 'cancelada',
        precio_noche: 680000,
        noches: 3,
      },
      {
        id: 828,
        codigo: 'TH-2026-0828',
        huesped_nombre: 'Pedro Gómez',
        huesped_email: 'pedro@correo.com',
        huesped_telefono: '+57 314 111 7890',
        huesped_pais: 'Colombia',
        huesped_idioma: 'Español',
        habitacion_nombre: 'Doble',
        fecha_checkin: '2026-03-05',
        fecha_checkout: '2026-03-09',
        num_huespedes: 2,
        fecha_creacion: '2026-02-18T11:00:00',
        monto_total: 2480000,
        moneda: 'COP',
        estado: 'confirmada',
        precio_noche: 620000,
        noches: 4,
      },
      {
        id: 825,
        codigo: 'TH-2026-0825',
        huesped_nombre: 'María Sánchez',
        huesped_email: 'maria@correo.com',
        huesped_telefono: '+57 315 000 1234',
        huesped_pais: 'Colombia',
        huesped_idioma: 'Español',
        habitacion_nombre: 'Sencilla',
        fecha_checkin: '2026-03-03',
        fecha_checkout: '2026-03-06',
        num_huespedes: 1,
        fecha_creacion: '2026-02-15T08:45:00',
        monto_total: 900000,
        moneda: 'COP',
        estado: 'confirmada',
        precio_noche: 300000,
        noches: 3,
      },
    ];

    let filtered = [...all];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) => r.codigo.toLowerCase().includes(q) || r.huesped_nombre.toLowerCase().includes(q),
      );
    }
    if (filters.estado && filters.estado !== 'all') {
      filtered = filtered.filter((r) => r.estado === filters.estado);
    }
    if (filters.habitacion && filters.habitacion !== 'all') {
      filtered = filtered.filter((r) => r.habitacion_nombre === filters.habitacion);
    }
    const page = filters.page ?? 1;
    const per_page = filters.per_page ?? 20;
    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * per_page, page * per_page);
    return of({ total, reservations: paginated });
  }

  getReservation(
    id: number,
  ): Observable<
    HotelReservation & { historial: { descripcion: string; fecha: string; color: string }[] }
  > {
    const res: HotelReservation = {
      id,
      codigo: 'TH-2026-0842',
      huesped_nombre: 'Juan David Díaz Rodríguez',
      huesped_email: 'juan.diaz@correo.com',
      huesped_telefono: '+57 310 555 1234',
      huesped_pais: 'Colombia',
      huesped_idioma: 'Español',
      habitacion_nombre: 'Suite Ejecutiva',
      fecha_checkin: '2026-03-15',
      fecha_checkout: '2026-03-20',
      num_huespedes: 2,
      fecha_creacion: '2026-03-01T14:35:00',
      monto_total: 2250000,
      moneda: 'COP',
      estado: 'confirmada',
      precio_noche: 450000,
      noches: 5,
    };
    return of({
      ...res,
      historial: [
        { descripcion: 'Reserva confirmada', fecha: '01 Mar 2026 · 14:35', color: 'green' },
        {
          descripcion: 'Email de confirmación enviado',
          fecha: '01 Mar 2026 · 14:36',
          color: 'blue',
        },
        {
          descripcion: 'Reserva creada por viajero',
          fecha: '01 Mar 2026 · 14:35 · Web',
          color: 'gray',
        },
      ],
    });
  }

  private rooms: Room[] = [
    {
      id: 1,
      hotel_id: 1,
      nombre: 'Suite Premium',
      tipo: 'suite',
      capacidad: 3,
      disponible: true,
      precio_noche: 680000,
      moneda: 'COP',
      descripcion: 'Vista panorámica, jacuzzi privado, sala de estar',
    },
    {
      id: 2,
      hotel_id: 1,
      nombre: 'Suite Ejecutiva',
      tipo: 'suite',
      capacidad: 2,
      disponible: true,
      precio_noche: 450000,
      moneda: 'COP',
      descripcion: 'WiFi premium, minibar, escritorio de trabajo',
    },
    {
      id: 3,
      hotel_id: 1,
      nombre: 'Habitación Doble',
      tipo: 'doble',
      capacidad: 2,
      disponible: true,
      precio_noche: 320000,
      moneda: 'COP',
      descripcion: 'WiFi, TV cable, baño privado',
    },
    {
      id: 4,
      hotel_id: 1,
      nombre: 'Habitación Sencilla',
      tipo: 'sencilla',
      capacidad: 1,
      disponible: true,
      precio_noche: 200000,
      moneda: 'COP',
      descripcion: 'WiFi, TV, baño privado',
    },
  ];

  getRooms(): Observable<Room[]> {
    return of([...this.rooms]);
  }

  createRoom(data: Omit<Room, 'id' | 'hotel_id'>): Observable<Room> {
    const newRoom: Room = { ...data, id: Date.now(), hotel_id: 1 };
    this.rooms.push(newRoom);
    return of(newRoom);
  }

  updateRoom(id: number, data: Partial<Omit<Room, 'id' | 'hotel_id'>>): Observable<Room> {
    const idx = this.rooms.findIndex((r) => r.id === id);
    if (idx !== -1) this.rooms[idx] = { ...this.rooms[idx], ...data };
    return of(this.rooms[idx]);
  }

  deleteRoom(id: number): Observable<{ message: string }> {
    this.rooms = this.rooms.filter((r) => r.id !== id);
    return of({ message: 'Habitación eliminada' });
  }

  updateTariff(roomId: number, precio: number): Observable<{ message: string }> {
    console.log(`Mock: updating room ${roomId} price to ${precio}`);
    return of({ message: 'Precio actualizado correctamente' });
  }
}
