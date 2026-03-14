import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  ciudad = '';
  checkIn = '';
  checkOut = '';
  huespedes = 1;
  cities: string[] = [];
  popularDestinations = ['Bogotá', 'Medellín', 'Cartagena', 'Cali', 'Santa Marta'];

  constructor(
    private catalog: CatalogService,
    private router: Router,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.catalog.getCities().subscribe({ next: (c) => (this.cities = c), error: () => {} });
  }

  selectCity(city: string) {
    this.ciudad = city;
  }

  search() {
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
