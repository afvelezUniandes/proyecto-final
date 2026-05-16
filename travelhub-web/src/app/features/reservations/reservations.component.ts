import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { ReservationService } from '../../core/services/reservation.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Reservation } from '../../core/models';

type TabKey = 'todas' | 'confirmada' | 'completada' | 'cancelada';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink, LanguageSelectorComponent, TranslateModule],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  hotelNames: Record<number, string> = {};
  loading = true;
  error = '';
  activeTab: TabKey = 'todas';
  tabs: TabKey[] = ['todas', 'confirmada', 'completada', 'cancelada'];
  cancelingId: number | null = null;
  confirmCancelId: number | null = null;
  cancelSuccessMsg = '';

  constructor(
    private reservationService: ReservationService,
    private catalog: CatalogService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.cancelSuccessMsg = '';
    this.loading = true;
    this.reservationService.getReservations().subscribe({
      next: (r) => {
        // Orden: más recientes primero (por fecha_checkin como referencia visible)
        this.reservations = [...r].sort((a, b) => {
          const da = new Date(a.fecha_checkin || a.fecha_creacion || 0).getTime();
          const db = new Date(b.fecha_checkin || b.fecha_creacion || 0).getTime();
          return db - da;
        });
        this.loadHotelNames();
        this.loading = false;
      },
      error: () => {
        this.error = this.translate.instant('RESERVATIONS.ERR_LOAD');
        this.loading = false;
      },
    });
  }

  private loadHotelNames() {
    const ids = Array.from(
      new Set(
        this.reservations
          .map((r) => r.hotel_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
    ids.forEach((id) => {
      if (this.hotelNames[id]) return;
      this.catalog.getHotel(id).subscribe({
        next: (h) => (this.hotelNames[id] = h.nombre),
        error: () => (this.hotelNames[id] = ''),
      });
    });
  }

  hotelName(r: Reservation): string {
    return r.hotel_id ? this.hotelNames[r.hotel_id] || '' : '';
  }

  filtered(): Reservation[] {
    if (this.activeTab === 'todas') return this.reservations;
    return this.reservations.filter((r) => (r.estado || '').toLowerCase() === this.activeTab);
  }

  tabLabel(tab: TabKey): string {
    const map: Record<TabKey, string> = {
      todas: 'RESERVATIONS.FILTER_ALL',
      confirmada: 'RESERVATIONS.FILTER_CONFIRMED',
      completada: 'RESERVATIONS.FILTER_COMPLETED',
      cancelada: 'RESERVATIONS.FILTER_CANCELLED',
    };
    return map[tab];
  }

  cancel(id: number) {
    this.confirmCancelId = id;
  }

  confirmCancel() {
    const id = this.confirmCancelId;
    if (!id) return;
    this.confirmCancelId = null;
    this.cancelingId = id;
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.cancelingId = null;
        this.cancelSuccessMsg = this.translate.instant('RESERVATIONS.CANCEL_SUCCESS');
        this.load();
      },
      error: () => {
        this.cancelingId = null;
        this.cancelSuccessMsg = '';
        alert(this.translate.instant('RESERVATIONS.ERR_CANCEL'));
      },
    });
  }

  dismissCancel() {
    this.confirmCancelId = null;
  }

  formatDate(d: string): string {
    const locale = this.translate.currentLang === 'en' ? 'en-US' : 'es-CO';
    return new Date(d).toLocaleDateString(locale, {
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
