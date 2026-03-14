import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
import { HotelReservation } from '../../core/models';

type ReservationFull = HotelReservation & { historial: { descripcion: string; fecha: string; color: string }[] };

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservation-detail.component.html',
})
export class ReservationDetailComponent implements OnInit {
  detail: ReservationFull | null = null;
  notFound = false;
  markCanceledSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private mockService: MockHotelAdminService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id') || 0);
    this.mockService.getReservation(id).subscribe({
      next: (r) => (this.detail = r as ReservationFull),
      error: () => (this.notFound = true),
    });
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
    };
    return map[estado?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }

  historialIcon(color: string): string {
    const map: Record<string, string> = { green: '✅', blue: '📧', gray: '📝', red: '❌' };
    return map[color] || '📌';
  }

  reenviarConfirmacion() {
    alert('Confirmación reenviada al correo del huésped. (simulado)');
  }

  imprimir() {
    window.print();
  }

  marcarCancelada() {
    if (this.detail && confirm('¿Deseas cancelar esta reserva?')) {
      this.detail = { ...this.detail, estado: 'cancelada' };
      this.markCanceledSuccess = true;
    }
  }
}
