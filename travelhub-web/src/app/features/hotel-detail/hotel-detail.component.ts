import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { CatalogService } from '../../core/services/catalog.service';
import { ReservationService } from '../../core/services/reservation.service';
import { AuthService } from '../../core/services/auth.service';
import { Hotel, Room } from '../../core/models';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent],
  templateUrl: './hotel-detail.component.html',
})
export class HotelDetailComponent implements OnInit {
  hotel: Hotel | null = null;
  rooms: Room[] = [];
  occupiedRoomIds: number[] = [];
  loading = true;
  error = '';
  selectedRoomId: number | null = null;
  checkIn = '';
  checkOut = '';
  adultos = 1;
  reserving = false;
  reserveError = '';
  reserveSuccess = false;
  searchParams: Record<string, string | number> = {};

  readonly amenities = [
    { icon: '🏊', label: 'Piscina' },
    { icon: '💪', label: 'Gimnasio' },
    { icon: '🧖', label: 'Spa' },
    { icon: '🐾', label: 'Mascotas' },
    { icon: '🍳', label: 'Desayuno' },
    { icon: '🚗', label: 'Parqueadero' },
    { icon: '📶', label: 'Wi-Fi' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
    private reservationService: ReservationService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const qp = this.route.snapshot.queryParams;
    this.checkIn = qp['checkIn'] || '';
    this.checkOut = qp['checkOut'] || '';
    this.adultos = +qp['huespedes'] || 1;

    this.searchParams = {
      ...(qp['ciudad'] ? { ciudad: qp['ciudad'] } : {}),
      ...(this.checkIn ? { checkIn: this.checkIn } : {}),
      ...(this.checkOut ? { checkOut: this.checkOut } : {}),
      ...(this.adultos ? { huespedes: this.adultos } : {}),
    };

    forkJoin({
      hotel: this.catalog.getHotel(+id),
      rooms: this.catalog.getRooms(+id),
    }).subscribe({
      next: ({ hotel, rooms }) => {
        this.hotel = hotel;
        this.rooms = rooms;
        this.loading = false;
        this.loadOccupiedRooms(+id);
      },
      error: () => {
        this.error = 'Hotel no encontrado.';
        this.loading = false;
      },
    });
  }

  loadOccupiedRooms(hotelId: number) {
    if (!this.checkIn || !this.checkOut) {
      this.autoSelectRoom();
      return;
    }
    this.catalog.getOccupiedRooms(hotelId, this.checkIn, this.checkOut).subscribe({
      next: (res) => {
        this.occupiedRoomIds = res.occupied_room_ids || [];
        this.rooms = this.rooms.map((r) => ({
          ...r,
          disponible: !this.occupiedRoomIds.includes(r.id),
        }));
        this.autoSelectRoom();
      },
      error: () => {
        this.autoSelectRoom();
      },
    });
  }

  autoSelectRoom() {
    const firstAvailable = this.rooms.find((r) => r.disponible);
    if (firstAvailable) this.selectedRoomId = firstAvailable.id;
  }

  selectedRoom(): Room | null {
    return this.rooms.find((r) => r.id === this.selectedRoomId) || null;
  }

  nights(): number {
    if (!this.checkIn || !this.checkOut) return 0;
    const diff = new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }

  total(): number {
    const room = this.selectedRoom();
    return room ? room.precio_noche * this.nights() : 0;
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(p);
  }

  reserve() {
    if (!this.selectedRoomId || !this.checkIn || !this.checkOut) {
      this.reserveError = 'Selecciona habitacion y fechas.';
      return;
    }
    if (!this.hotel) return;

    this.reserving = true;
    this.reserveError = '';
    this.reservationService
      .createReservation({
        habitacion_id: this.selectedRoomId,
        hotel_id: this.hotel.id,
        fecha_checkin: this.checkIn,
        fecha_checkout: this.checkOut,
        num_huespedes: this.adultos,
        monto_total: this.total(),
        moneda: 'COP',
      })
      .subscribe({
        next: () => {
          this.reserveSuccess = true;
          this.reserving = false;
        },
        error: (e) => {
          this.reserveError = e?.error?.error || 'Error al crear la reserva.';
          this.reserving = false;
        },
      });
  }

  stars(n: number): string[] {
    return Array(n).fill('★');
  }
}
