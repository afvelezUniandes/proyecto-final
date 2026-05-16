import { ChangeDetectorRef, Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { ReservationService } from '../../core/services/reservation.service';
import { HotelReservation } from '../../core/models';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './reservation-detail.component.html',
})
export class ReservationDetailComponent implements OnInit {
  detail = signal<HotelReservation | null>(null);
  notFound = signal(false);
  markCanceledSuccess = signal(false);
  cancelError = signal('');
  canceling = signal(false);
  showCancelModal = signal(false);
  private hotelId = 0;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private reservationService: ReservationService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.hotelService
      .loadMyHotel()
      .pipe(
        switchMap((h) => {
          this.hotelId = h.id;
          return this.reservationService.getReservationById(h.id, id);
        }),
      )
      .subscribe({
        next: (reservation) => {
          this.detail.set(reservation);
        },
        error: () => this.notFound.set(true),
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

  reenviarConfirmacion() {
    alert(this.translate.instant('RESERVATION_DETAIL.RESEND_OK'));
  }

  imprimir() {
    window.print();
  }

  marcarCancelada() {
    const d = this.detail();
    if (!d) return;
    this.showCancelModal.set(true);
  }

  dismissCancelModal() {
    this.showCancelModal.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showCancelModal()) this.showCancelModal.set(false);
  }

  confirmarCancelacion() {
    const d = this.detail();
    if (!d) return;
    this.showCancelModal.set(false);
    this.canceling.set(true);
    this.cancelError.set('');
    this.reservationService.cancelReservation(this.hotelId, d.id).subscribe({
      next: (updated) => {
        this.detail.set({
          ...d,
          estado: updated.estado,
          fecha_cancelacion: updated.fecha_cancelacion,
        });
        this.markCanceledSuccess.set(true);
        this.canceling.set(false);
      },
      error: (e) => {
        this.cancelError.set('RESERVATION_DETAIL.CANCEL_ERR');
        this.canceling.set(false);
      },
    });
  }
}
