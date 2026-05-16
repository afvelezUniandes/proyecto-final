import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, switchMap, finalize } from 'rxjs';
import { HotelService } from '../../core/services/hotel.service';
import { RoomService } from '../../core/services/room.service';
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
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './tariffs.component.html',
})
export class TariffsComponent implements OnInit {
  rows: TariffRow[] = [];
  loading = false;
  loadError = '';

  constructor(
    private hotelService: HotelService,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loading = true;
    const hotel = this.hotelService.hotel();
    const hotel$ = hotel ? of(hotel) : this.hotelService.loadMyHotel();

    hotel$
      .pipe(
        switchMap((h) => this.roomService.list(h.id)),
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
          this.loadError = 'TARIFFS.ERR_LOAD';
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
    const raw = row.newPrice;
    const price = Math.round(parseFloat(raw));

    // Validar entero positivo
    if (!raw || isNaN(price) || price <= 0) {
      row.saveError = 'TARIFFS.ERR_INVALID_PRICE';
      this.cdr.markForCheck();
      return;
    }
    if (String(price) !== String(Math.floor(parseFloat(raw)))) {
      // nunca llega aquí por el Math.round, pero lo dejamos como guarda
    }
    if (parseFloat(raw) !== Math.floor(parseFloat(raw))) {
      row.saveError = 'TARIFFS.ERR_INTEGER_PRICE';
      this.cdr.markForCheck();
      return;
    }

    row.saving = true;
    row.saved = false;
    row.saveError = '';
    this.cdr.markForCheck();

    this.roomService.update(row.id, { precio_noche: price }).subscribe({
      next: (updated) => {
        row.saving = false;
        row.precio_noche = updated.precio_noche;
        row.newPrice = String(updated.precio_noche);
        row.saved = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          row.saved = false;
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (err) => {
        row.saving = false;
        row.saveError = 'TARIFFS.ERR_UPDATE';
        this.cdr.markForCheck();
      },
    });
  }
}
