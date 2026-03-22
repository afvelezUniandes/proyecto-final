import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Reservation, Room } from '../../../core/models';
import { map } from 'rxjs';

@Component({
  selector: 'app-hotel-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-reservation-detail.component.html',
})
export class HotelReservationDetailComponent implements OnInit {
  reservation = signal<Reservation | null>(null);
  room = signal<Room | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private hotelAdmin: HotelAdminService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.hotelAdmin.getMyHotel().subscribe({
      next: (hotel) => {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.hotelAdmin.getHotelReservations(hotel.id).subscribe({
          next: (reservas) => {
            const found = reservas.find(r => r.id === id);
            this.reservation.set(found || null);
            if (found) {
              this.hotelAdmin.getRooms(hotel.id).pipe(
                map(rooms => rooms.find(r => r.id === found.habitacion_id) || null)
              ).subscribe({ next: (r) => this.room.set(r) });
            }
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }

  nights(): number {
    const r = this.reservation();
    if (!r?.fecha_checkin || !r?.fecha_checkout) return 0;
    const d1 = new Date(r.fecha_checkin);
    const d2 = new Date(r.fecha_checkout);
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
  }

  statusClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700 border-green-200',
      cancelada: 'bg-red-100 text-red-700 border-red-200',
      completada: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return map[estado.toLowerCase()] || 'bg-gray-100 text-gray-600';
  }

  logout() {
    this.auth.logout();
  }
}
