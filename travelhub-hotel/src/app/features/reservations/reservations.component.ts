import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
import { HotelReservation } from '../../core/models';

@Component({
  selector: 'app-hotel-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent implements OnInit {
  reservations: HotelReservation[] = [];
  total = 0;
  page = 1;
  pageSize = 10;

  searchQuery = '';
  estadoFilter = '';
  estadoOptions = ['', 'confirmada', 'completada', 'cancelada'];
  habitacionOptions: string[] = [];
  habitacionFilter = '';

  constructor(
    private mockService: MockHotelAdminService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.mockService.getRooms().subscribe({
      next: (rooms) => {
        this.habitacionOptions = ['', ...rooms.map((r) => r.nombre)];
      },
    });
    this.load();
  }

  load() {
    this.mockService
      .getReservations({
        search: this.searchQuery,
        estado: this.estadoFilter || undefined,
        habitacion: this.habitacionFilter || undefined,
        page: this.page,
        per_page: this.pageSize,
      })
      .subscribe({
        next: (res) => {
          this.reservations = res.reservations;
          this.total = res.total;
        },
      });
  }

  viewDetail(id: number) {
    this.router.navigate(['/reservations', id]);
  }

  resetFilters() {
    this.searchQuery = '';
    this.estadoFilter = '';
    this.habitacionFilter = '';
    this.page = 1;
    this.load();
  }

  prevPage() {
    if (this.page > 1) { this.page--; this.load(); }
  }

  nextPage() {
    if (this.page * this.pageSize < this.total) { this.page++; this.load(); }
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
