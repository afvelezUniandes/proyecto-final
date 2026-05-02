import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../core/models';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, LanguageSelectorComponent, TranslateModule],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  error = '';
  activeTab = 'todas';
  cancelingId: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.reservationService.getReservations().subscribe({
      next: (r) => {
        this.reservations = r;
        this.loading = false;
      },
      error: () => {
        this.error = this.translate.instant('RESERVATIONS.ERR_LOAD');
        this.loading = false;
      },
    });
  }

  filtered(): Reservation[] {
    if (this.activeTab === 'todas') return this.reservations;
    return this.reservations.filter((r) => r.estado?.toLowerCase() === this.activeTab);
  }

  cancel(id: number) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    this.cancelingId = id;
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.cancelingId = null;
        this.load();
      },
      error: () => {
        this.cancelingId = null;
        alert('No se pudo cancelar.');
      },
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('es-CO', {
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
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
      pendiente: 'bg-yellow-100 text-yellow-700',
    };
    return map[estado?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }
}
