import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CatalogService } from '../../core/services/catalog.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent, TranslateModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  ciudad = '';
  checkIn = '';
  checkOut = '';
  huespedes = 1;
  cities: string[] = [];
  popularDestinations = ['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Santa Marta'];
  dateError = '';

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
    private catalog: CatalogService,
    private router: Router,
    public auth: AuthService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkIn = this.today;
    this.checkOut = this.localDateStr(tomorrow);
    this.catalog.getCities().subscribe({ next: (c) => (this.cities = c), error: () => {} });
  }

  selectCity(city: string) {
    this.ciudad = city;
  }

  search() {
    this.dateError = '';
    const today = this.today;
    if (this.checkIn && this.checkIn < today) {
      this.dateError = this.translate.instant('HOME.DATE_ERROR_CHECKIN');
      return;
    }
    if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
      this.dateError = this.translate.instant('HOME.DATE_ERROR_CHECKOUT');
      return;
    }
    this.router.navigate(['/search'], {
      queryParams: {
        ciudad: this.ciudad,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        huespedes: this.huespedes,
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  userInitials(): string {
    const user = this.auth.currentUser();
    if (!user) return 'U';
    const name: string = (user as any)['nombre'] || (user as any)['email'] || '';
    return (
      name
        .split(' ')
        .slice(0, 2)
        .map((p: string) => p[0])
        .join('')
        .toUpperCase() || 'U'
    );
  }
}
