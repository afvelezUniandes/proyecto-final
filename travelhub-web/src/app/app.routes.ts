import { Routes } from '@angular/router';
import { authGuard, guestGuard, hotelGuard } from './core/guards/auth.guard';

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
  // Hotel admin portal (before hotel/:id to avoid conflict)
  {
    path: 'hotel/login',
    loadComponent: () =>
      import('./features/hotel-admin/login/hotel-login.component').then((m) => m.HotelLoginComponent),
  },
  {
    path: 'hotel/dashboard',
    loadComponent: () =>
      import('./features/hotel-admin/dashboard/hotel-dashboard.component').then((m) => m.HotelDashboardComponent),
    canActivate: [hotelGuard],
  },
  {
    path: 'hotel/reservations',
    loadComponent: () =>
      import('./features/hotel-admin/reservations/hotel-reservations.component').then((m) => m.HotelReservationsComponent),
    canActivate: [hotelGuard],
  },
  {
    path: 'hotel/reservations/:id',
    loadComponent: () =>
      import('./features/hotel-admin/reservation-detail/hotel-reservation-detail.component').then((m) => m.HotelReservationDetailComponent),
    canActivate: [hotelGuard],
  },
  {
    path: 'hotel/rooms',
    loadComponent: () =>
      import('./features/hotel-admin/rooms/hotel-rooms.component').then((m) => m.HotelRoomsComponent),
    canActivate: [hotelGuard],
  },
  {
    path: 'hotel/tarifas',
    loadComponent: () =>
      import('./features/hotel-admin/tarifas/hotel-tarifas.component').then((m) => m.HotelTarifasComponent),
    canActivate: [hotelGuard],
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
    canActivate: [authGuard],
  },
  {
    path: 'reservations/:id',
    loadComponent: () =>
      import('./features/reservation-detail/reservation-detail.component').then(
        (m) => m.ReservationDetailComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'home' },
];
