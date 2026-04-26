import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of, switchMap, finalize } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { Room } from '../../core/models';

interface TariffRow extends Room {
  newPrice: string;
  saving: boolean;
  saved: boolean;
  saveError: string;
}

@Component({
  selector: 'app-tariffs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tariffs.component.html',
})
export class TariffsComponent implements OnInit {
  rows: TariffRow[] = [];
  loading = false;
  loadError = '';

  constructor(
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loading = true;
    const hotel = this.hotelService.hotel();
    const hotel$ = hotel ? of(hotel) : this.hotelService.loadMyHotel();

    hotel$
      .pipe(
        switchMap((h) => this.hotelService.getRooms(h.id)),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (rooms) => {
          this.rows = rooms.map((r) => ({
            ...r,
            newPrice: String(r.precio_noche ?? 0),
            saving: false,
            saved: false,
            saveError: '',
          }));
        },
        error: () => {
          this.loadError = 'No se pudieron cargar las habitaciones.';
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

  updateTariff(row: TariffRow) {
    const price = parseFloat(row.newPrice);
    if (!price || price <= 0 || isNaN(price)) {
      row.saveError = 'Ingresa un precio válido mayor a 0.';
      return;
    }
    row.saving = true;
    row.saved = false;
    row.saveError = '';
    this.hotelService.updateRoom(row.id, { precio_noche: price }).subscribe({
      next: (updated) => {
        row.saving = false;
        row.precio_noche = updated.precio_noche;
        row.newPrice = String(updated.precio_noche);
        row.saved = true;
        setTimeout(() => (row.saved = false), 3000);
      },
      error: (err) => {
        row.saving = false;
        row.saveError = err?.error?.error || 'Error al actualizar el precio.';
      },
    });
  }
}
