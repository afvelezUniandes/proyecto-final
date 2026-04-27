import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { ReservationService } from '../../core/services/reservation.service';
import { HotelReservation } from '../../core/models';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservation-detail.component.html',
})
export class ReservationDetailComponent implements OnInit {
  detail: HotelReservation | null = null;
  notFound = false;
  markCanceledSuccess = false;
  cancelError = '';
  canceling = false;
  private hotelId = 0;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private reservationService: ReservationService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.hotelService
      .loadMyHotel()
      .pipe(
        switchMap((h) => {
          this.hotelId = h.id;
          return this.reservationService.getReservations(h.id);
        }),
      )
      .subscribe({
        next: (reservations) => {
          const found = reservations.find((r) => r.id === id);
          if (found) {
            this.detail = found;
          } else {
            this.notFound = true;
          }
        },
        error: () => (this.notFound = true),
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
    alert('Confirmación reenviada al correo del huésped. (simulado)');
  }

  imprimir() {
    window.print();
  }

  marcarCancelada() {
    if (!this.detail || !confirm('¿Deseas cancelar esta reserva?')) return;
    this.canceling = true;
    this.cancelError = '';
    this.reservationService.cancelReservation(this.hotelId, this.detail.id).subscribe({
      next: (updated) => {
        this.detail = { ...this.detail!, estado: updated.estado };
        this.markCanceledSuccess = true;
        this.canceling = false;
      },
      error: (e) => {
        this.cancelError = e?.error?.error || 'Error al cancelar la reserva.';
        this.canceling = false;
      },
    });
  }
}
