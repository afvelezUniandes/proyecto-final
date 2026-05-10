import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { ReservationService } from '../../core/services/reservation.service';
import { HotelReservation } from '../../core/models';

@Component({
  selector: 'app-hotel-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit {
  allReservations: HotelReservation[] = [];
  reservations: HotelReservation[] = [];
  total = 0;
  page = 1;
  pageSize = 20;
  loading = true;
  loadError = '';

  searchQuery = '';
  estadoFilter = '';
  estadoOptions = ['', 'confirmada', 'completada', 'cancelada'];
  habitacionOptions: string[] = [];
  habitacionFilter = '';
  fechaDesde = '';
  fechaHasta = '';

  constructor(
    private hotelService: HotelService,
    private reservationService: ReservationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.hotelService
      .loadMyHotel()
      .pipe(switchMap((h) => this.reservationService.getReservations(h.id)))
      .subscribe({
        next: (reservations) => {
          this.allReservations = reservations;
          this.habitacionOptions = [
            '',
            ...Array.from(
              new Set(reservations.map((r) => r.habitacion_nombre).filter((n): n is string => !!n)),
            ),
          ];
          this.loading = false;
          this.applyFilters();
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadError = 'No se pudieron cargar las reservas.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  applyFilters() {
    let filtered = [...this.allReservations];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) => r.codigo?.toLowerCase().includes(q) || r.huesped_nombre?.toLowerCase().includes(q),
      );
    }
    if (this.estadoFilter) {
      filtered = filtered.filter((r) => r.estado === this.estadoFilter);
    }
    if (this.habitacionFilter) {
      filtered = filtered.filter((r) => r.habitacion_nombre === this.habitacionFilter);
    }
    if (this.fechaDesde) {
      filtered = filtered.filter((r) => r.fecha_checkin >= this.fechaDesde);
    }
    if (this.fechaHasta) {
      filtered = filtered.filter((r) => r.fecha_checkout <= this.fechaHasta);
    }
    this.total = filtered.length;
    this.reservations = filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  load() {
    this.page = 1;
    this.applyFilters();
  }

  viewDetail(id: number) {
    this.router.navigate(['/reservations', id]);
  }

  resetFilters() {
    this.searchQuery = '';
    this.estadoFilter = '';
    this.habitacionFilter = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.page = 1;
    this.applyFilters();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.page * this.pageSize < this.total) {
      this.page++;
      this.applyFilters();
    }
  }

  totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
    };
    return map[estado?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  }
}
