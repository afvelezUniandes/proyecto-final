import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'hotel/:id',
    loadComponent: () =>
      import('./features/hotel-detail/hotel-detail.component').then((m) => m.HotelDetailComponent),
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./features/reservations/reservations.component').then((m) => m.ReservationsComponent),
  },
  {
    path: 'reservations/:id',
    loadComponent: () =>
      import('./features/reservation-detail/reservation-detail.component').then(
        (m) => m.ReservationDetailComponent,
      ),
  },
  { path: '**', redirectTo: 'home' },
];
