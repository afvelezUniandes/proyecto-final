import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { CatalogService } from '../../core/services/catalog.service';
import { Hotel } from '../../core/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = false;
  ciudad = '';
  checkIn = '';
  checkOut = '';
  huespedes = 1;
  page = 1;
  total = 0;
  pageSize = 10;
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'stars' = 'default';
  error = '';
  dateError = '';
  sortOptions = [
    { key: 'default', label: 'Relevancia' },
    { key: 'stars', label: '⭐ Estrellas' },
    { key: 'price_asc', label: '💰 Precio ↑' },
    { key: 'price_desc', label: '💰 Precio ↓' },
  ];

  private localDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  get today(): string {
    return this.localDateStr(new Date());
  }

  get minCheckOut(): string {
    if (this.checkIn) {
      const d = new Date(this.checkIn + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      return this.localDateStr(d);
    }
    return this.today;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.ciudad = params['ciudad'] || '';
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.checkIn = params['checkIn'] || this.today;
      this.checkOut = params['checkOut'] || this.localDateStr(tomorrow);
      this.huespedes = +params['huespedes'] || 1;
      this.page = +params['page'] || 1;
      this.loadHotels();
    });
  }

  loadHotels() {
    this.dateError = '';
    const today = this.today;
    if (this.checkIn && this.checkIn < today) {
      this.dateError = 'La fecha de check-in no puede ser anterior a hoy.';
      return;
    }
    if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
      this.dateError = 'La fecha de check-out debe ser posterior al check-in.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.catalog
      .getHotels({
        ciudad: this.ciudad || undefined,
        fechaCheckin: this.checkIn || undefined,
        fechaCheckout: this.checkOut || undefined,
        capacidad: this.huespedes > 0 ? this.huespedes : undefined,
        page: this.page,
      })
      .subscribe({
        next: (res) => {
          this.hotels = res.hotels || [];
          this.total = res.total || this.hotels.length;
          this.loading = false;
          this.applySort();
        },
        error: () => {
          this.error = 'No se pudieron cargar los hoteles. Intenta nuevamente.';
          this.loading = false;
        },
      });
  }

  applySort() {
    if (this.sortBy === 'price_asc') {
      this.hotels = [...this.hotels].sort((a, b) => (a.precio_noche || 0) - (b.precio_noche || 0));
    } else if (this.sortBy === 'price_desc') {
      this.hotels = [...this.hotels].sort((a, b) => (b.precio_noche || 0) - (a.precio_noche || 0));
    } else if (this.sortBy === 'stars') {
      this.hotels = [...this.hotels].sort((a, b) => (b.estrellas || 0) - (a.estrellas || 0));
    }
  }

  setSortBy(sort: 'default' | 'price_asc' | 'price_desc' | 'stars') {
    this.sortBy = sort;
    this.applySort();
  }

  goToDetail(id: number | string) {
    this.router.navigate(['/hotel', id], {
      queryParams: {
        ciudad: this.ciudad || '',
        checkIn: this.checkIn || '',
        checkOut: this.checkOut || '',
        huespedes: this.huespedes || 1,
      },
    });
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadHotels();
    }
  }

  nextPage() {
    if (this.page * this.pageSize < this.total) {
      this.page++;
      this.loadHotels();
    }
  }

  stars(n: number): string[] {
    return Array(n).fill('★');
  }

  formatPrice(p: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(p);
  }
}
