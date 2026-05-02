import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Room, HotelDetail } from '../../../core/models';
import { map } from 'rxjs';

@Component({
  selector: 'app-hotel-tarifas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './hotel-tarifas.component.html',
})
export class HotelTarifasComponent implements OnInit {
  hotel = signal<HotelDetail | null>(null);
  rooms = signal<Room[]>([]);
  loading = signal(true);

  newPrices: Record<number, number> = {};
  updatingId: number | null = null;

  constructor(
    private hotelAdmin: HotelAdminService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.hotelAdmin.getMyHotel().subscribe({
      next: (h) => {
        this.hotel.set(h);
        this.loadRooms(h.id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadRooms(hotelId: number) {
    this.hotelAdmin
      .getRooms(hotelId)
      .pipe(map((rooms) => rooms.filter((r) => r.hotel_id === hotelId)))
      .subscribe({
        next: (rooms) => {
          this.rooms.set(rooms);
          rooms.forEach((r) => (this.newPrices[r.id] = r.precio_noche));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  updatePrice(room: Room) {
    const newPrice = this.newPrices[room.id];
    if (!newPrice || newPrice === room.precio_noche) return;
    this.updatingId = room.id;
    this.hotelAdmin.updateRoom(room.id, { precio_noche: newPrice }).subscribe({
      next: () => {
        this.updatingId = null;
        const h = this.hotel();
        if (h) this.loadRooms(h.id);
      },
      error: () => (this.updatingId = null),
    });
  }

  logout() {
    this.auth.logout();
  }
}
