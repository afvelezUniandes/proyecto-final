import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
import { HotelService } from '../../core/services/hotel.service';
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
  uploadingImage = false;
  uploadError = '';
  uploadSuccess = false;

  constructor(
    private mockService: MockHotelAdminService,
    public hotelService: HotelService,
  ) {}

  ngOnInit() {
    this.hotelService.loadMyHotel().subscribe({
      error: (err) => console.error('[HotelService] loadMyHotel failed:', err),
    });
    this.mockService.getStats().subscribe({ next: (s) => (this.stats = s) });
    this.mockService.getWeeklyOccupancy().subscribe({ next: (w) => (this.weeklyOccupancy = w) });
    this.mockService.getReservations({}).subscribe({
      next: (res) => {
        this.recentReservations = res.reservations.slice(0, 5);
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
