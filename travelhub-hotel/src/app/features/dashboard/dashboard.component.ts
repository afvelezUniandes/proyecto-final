import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap, forkJoin } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { ReservationService } from '../../core/services/reservation.service';
import { HotelStats, HotelReservation, WeeklyOccupancy } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  stats = signal<HotelStats | null>(null);
  recentReservations = signal<HotelReservation[]>([]);
  weeklyOccupancy = signal<WeeklyOccupancy[]>([]);
  loading = signal(true);
  loadError = signal('');
  uploadingImage = signal(false);
  uploadError = signal('');
  uploadSuccess = signal(false);

  constructor(
    private reservationService: ReservationService,
    public hotelService: HotelService,
  ) {}

  ngOnInit() {
    this.hotelService
      .loadMyHotel()
      .pipe(
        switchMap((h) =>
          forkJoin({
            statsResp: this.reservationService.getStats(h.id),
            reservations: this.reservationService.getReservations(h.id),
          }),
        ),
      )
      .subscribe({
        next: ({ statsResp, reservations }) => {
          const { weekly_occupancy, ...statsFields } = statsResp;
          this.stats.set(statsFields);
          this.weeklyOccupancy.set(weekly_occupancy || []);
          this.recentReservations.set(reservations.slice(0, 5));
          this.loading.set(false);
        },
        error: () => {
          this.loadError.set('DASHBOARD.ERR_LOAD');
          this.loading.set(false);
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
    return Math.max(...this.weeklyOccupancy().map((d) => d.porcentaje), 1);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const hotel = this.hotelService.hotel();
    if (!hotel) return;
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError.set('AUTH.ERR_IMAGE_SIZE');
      return;
    }
    this.uploadError.set('');
    this.uploadSuccess.set(false);
    this.uploadingImage.set(true);
    this.hotelService.uploadImage(hotel.id, file).subscribe({
      next: () => {
        this.uploadingImage.set(false);
        this.uploadSuccess.set(true);
      },
      error: (e) => {
        this.uploadingImage.set(false);
        this.uploadError.set(e?.error?.error || 'Error al subir la imagen.');
      },
    });
  }
}
