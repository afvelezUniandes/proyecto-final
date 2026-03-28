import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { HotelDetail, Reservation, Room } from '../../../core/models';
import { map } from 'rxjs';

@Component({
  selector: 'app-hotel-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-dashboard.component.html',
})
export class HotelDashboardComponent implements OnInit {
  hotel = signal<HotelDetail | null>(null);
  reservations = signal<Reservation[]>([]);
  rooms = signal<Room[]>([]);
  loading = signal(true);

  constructor(
    private hotelAdmin: HotelAdminService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.hotelAdmin.getMyHotel().subscribe({
      next: (h) => {
        this.hotel.set(h);
        this.loadData(h.id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadData(hotelId: number) {
    this.hotelAdmin.getHotelReservations(hotelId).subscribe({
      next: (res) => {
        this.reservations.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.hotelAdmin.getRooms(hotelId).pipe(
      map(rooms => rooms.filter(r => r.hotel_id === hotelId))
    ).subscribe({
      next: (rooms) => this.rooms.set(rooms),
    });
  }

  activeReservations(): number {
    return this.reservations().filter(r => r.estado === 'confirmada').length;
  }

  totalRevenue(): number {
    return this.reservations()
      .filter(r => r.estado !== 'cancelada')
      .reduce((sum, r) => sum + (r.monto_total || 0), 0);
  }

  occupancyRate(): number {
    const totalRooms = this.rooms().length;
    if (!totalRooms) return 0;
    const occupied = this.reservations().filter(r => r.estado === 'confirmada').length;
    return Math.min(Math.round((occupied / totalRooms) * 100), 100);
  }

  recentReservations(): Reservation[] {
    return this.reservations().slice(0, 5);
  }

  statusClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      cancelada: 'bg-red-100 text-red-700',
      completada: 'bg-gray-100 text-gray-700',
    };
    return map[estado.toLowerCase()] || 'bg-gray-100 text-gray-600';
  }

  logout() {
    this.auth.logout();
  }
}
