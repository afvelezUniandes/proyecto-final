import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Reservation, HotelDetail, Room } from '../../../core/models';
import { map } from 'rxjs';

@Component({
  selector: 'app-hotel-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hotel-reservations.component.html',
})
export class HotelReservationsComponent implements OnInit {
  hotel = signal<HotelDetail | null>(null);
  reservations = signal<Reservation[]>([]);
  rooms = signal<Room[]>([]);
  loading = signal(true);

  filterEstado = '';
  filterCodigo = '';
  filterFechaDesde = '';
  filterFechaHasta = '';

  constructor(
    private hotelAdmin: HotelAdminService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.hotelAdmin.getMyHotel().subscribe({
      next: (h) => {
        this.hotel.set(h);
        this.loadReservations(h.id);
        this.hotelAdmin.getRooms(h.id).pipe(
          map(rooms => rooms.filter(r => r.hotel_id === h.id))
        ).subscribe({ next: (rooms) => this.rooms.set(rooms) });
      },
      error: () => this.loading.set(false),
    });
  }

  loadReservations(hotelId: number) {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.filterEstado) params['estado'] = this.filterEstado;
    if (this.filterCodigo) params['codigo'] = this.filterCodigo;
    if (this.filterFechaDesde) params['fecha_desde'] = this.filterFechaDesde;
    if (this.filterFechaHasta) params['fecha_hasta'] = this.filterFechaHasta;

    this.hotelAdmin.getHotelReservations(hotelId, params).subscribe({
      next: (res) => {
        this.reservations.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters() {
    const h = this.hotel();
    if (h) this.loadReservations(h.id);
  }

  clearFilters() {
    this.filterEstado = '';
    this.filterCodigo = '';
    this.filterFechaDesde = '';
    this.filterFechaHasta = '';
    this.applyFilters();
  }

  statusClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
      completada: 'bg-gray-100 text-gray-700',
    };
    return map[estado.toLowerCase()] || 'bg-gray-100 text-gray-600';
  }

  roomName(habitacionId: number): string {
    const room = this.rooms().find(r => r.id === habitacionId);
    return room ? `${room.nombre} (${room.tipo})` : `#${habitacionId}`;
  }

  logout() {
    this.auth.logout();
  }
}
