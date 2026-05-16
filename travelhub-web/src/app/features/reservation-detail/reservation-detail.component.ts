import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ReservationService } from '../../core/services/reservation.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Reservation, Hotel } from '../../core/models';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NavbarComponent],
  templateUrl: './reservation-detail.component.html',
})
export class ReservationDetailComponent implements OnInit {
  reservation: Reservation | null = null;
  hotel: Hotel | null = null;
  loading = true;
  error = '';
  canceling = false;
  cancelSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private catalog: CatalogService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.reservationService.getReservation(id).subscribe({
      next: (r) => {
        this.reservation = r;
        if (r.hotel_id) {
          this.catalog.getHotel(r.hotel_id).subscribe({
            next: (h) => {
              this.hotel = h;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'No se encontró la reserva.';
        this.loading = false;
      },
    });
  }

  nights(): number {
    if (!this.reservation) return 0;
    const start = this.reservation.fecha_checkin;
    const end = this.reservation.fecha_checkout;
    if (!start || !end) return 0;
    return Math.max(
      0,
      Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000),
    );
  }

  cancel() {
    if (!this.reservation) return;
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    this.canceling = true;
    this.reservationService.cancelReservation(this.reservation.id).subscribe({
      next: () => {
        this.reservation!.estado = 'cancelada';
        this.canceling = false;
        this.cancelSuccess = true;
      },
      error: () => {
        this.canceling = false;
        alert(this.translate.instant('RESERVATIONS.ERR_CANCEL'));
      },
    });
  }

  formatDate(d: string): string {
    const locale = this.translate.currentLang === 'en' ? 'en-US' : 'es-CO';
    const [year, month, day] = d.split('T')[0].split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(locale, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      confirmada: 'bg-green-100 text-green-700 border-green-200',
      completada: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelada: 'bg-red-100 text-red-700 border-red-200',
      pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    return map[estado?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  }

  stars(n: number): string[] {
    return Array(n).fill('★');
  }
}
