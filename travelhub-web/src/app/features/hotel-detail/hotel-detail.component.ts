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
  loading = true;
  error = '';
  selectedRoomId: number | null = null;
  checkIn = '';
  checkOut = '';
  adultos = 1;
  reserving = false;
  reserveError = '';
  reserveSuccess = false;

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

    forkJoin({
      hotel: this.catalog.getHotel(+id),
      rooms: this.catalog.getRooms(+id),
    }).subscribe({
      next: ({ hotel, rooms }) => {
        this.hotel = hotel;
        this.rooms = rooms;
        // Auto-select first available room
        const firstAvailable = rooms.find((r) => r.disponible);
        if (firstAvailable) this.selectedRoomId = firstAvailable.id;
        this.loading = false;
      },
      error: () => {
        this.error = 'Hotel no encontrado.';
        this.loading = false;
      },
    });
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
      this.reserveError = 'Selecciona habitación y fechas.';
      return;
    }
    this.reserving = true;
    this.reserveError = '';
    this.reservationService
      .createReservation({
        habitacion_id: this.selectedRoomId,
        fecha_inicio: this.checkIn,
        fecha_fin: this.checkOut,
        adultos: this.adultos,
        ninos: 0,
      })
      .subscribe({
        next: () => {
          this.reserveSuccess = true;
          this.reserving = false;
        },
        error: (e) => {
          this.reserveError = e?.error?.mensaje || 'Error al crear la reserva.';
          this.reserving = false;
        },
      });
  }

  stars(n: number): string[] {
    return Array(n).fill('★');
  }
}
