import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockHotelAdminService } from '../../core/services/mocks/mock-hotel-admin.service';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './tariffs.component.html',
})
export class TariffsComponent implements OnInit {
  rows: TariffRow[] = [];

  constructor(private mockService: MockHotelAdminService) {}

  ngOnInit() {
    this.mockService.getRooms().subscribe({
      next: (rooms) => {
        this.rows = rooms.map((r) => ({
          ...r,
          newPrice: String(r.precio_noche),
          saving: false,
          saved: false,
          saveError: '',
        }));
      },
    });
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }

  updateTariff(row: TariffRow) {
    const price = parseFloat(row.newPrice);
    if (!price || price <= 0) {
      row.saveError = 'Ingresa un precio válido mayor a 0.';
      return;
    }
    row.saving = true;
    row.saved = false;
    row.saveError = '';
    this.mockService.updateTariff(row.id, price).subscribe({
      next: () => {
        row.saving = false;
        row.precio_noche = price;
        row.saved = true;
        setTimeout(() => (row.saved = false), 3000);
      },
      error: () => {
        row.saving = false;
        row.saveError = 'Error al actualizar.';
      },
    });
  }
}
