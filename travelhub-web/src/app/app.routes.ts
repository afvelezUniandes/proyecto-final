import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'hotel/:id',
    loadComponent: () => import('./features/hotel-detail/hotel-detail.component').then(m => m.HotelDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reservations',
    loadComponent: () => import('./features/reservations/reservations.component').then(m => m.ReservationsComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
