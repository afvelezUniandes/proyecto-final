import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { ReservationService } from '../../core/services/reservation.service';
import { HotelStats, HotelReservation, WeeklyOccupancy } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats: HotelStats | null = null;
  recentReservations: HotelReservation[] = [];
  weeklyOccupancy: WeeklyOccupancy[] = [];
  loading = true;
  loadError = '';
  uploadingImage = false;
  uploadError = '';
  uploadSuccess = false;

  constructor(
    private reservationService: ReservationService,
    public hotelService: HotelService,
  ) {}

  ngOnInit() {
    const hotel = this.hotelService.hotel();
    const hotel$ = hotel ? [hotel] : null;

    this.hotelService
      .loadMyHotel()
      .pipe(switchMap((h) => this.reservationService.getStats(h.id)))
      .subscribe({
        next: (statsResp) => {
          const { weekly_occupancy, ...statsFields } = statsResp;
          this.stats = statsFields;
          this.weeklyOccupancy = weekly_occupancy || [];
        },
        error: () => {
          this.loadError = 'No se pudieron cargar las estadísticas.';
        },
      });

    this.hotelService
      .loadMyHotel()
      .pipe(switchMap((h) => this.reservationService.getReservations(h.id, { per_page: 5 })))
      .subscribe({
        next: (reservations) => {
          this.recentReservations = reservations.slice(0, 5);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(p);
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
    };
    return map[estado?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }

  maxOccupancy(): number {
    return Math.max(...this.weeklyOccupancy.map((d) => d.porcentaje), 1);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const hotel = this.hotelService.hotel();
    if (!hotel) return;
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'La imagen no puede superar 5 MB.';
      return;
    }
    this.uploadError = '';
    this.uploadSuccess = false;
    this.uploadingImage = true;
    this.hotelService.uploadImage(hotel.id, file).subscribe({
      next: () => {
        this.uploadingImage = false;
        this.uploadSuccess = true;
      },
      error: (e) => {
        this.uploadingImage = false;
        this.uploadError = e?.error?.error || 'Error al subir la imagen.';
      },
    });
  }
}
