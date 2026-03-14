import { Routes } from '@angular/router';
import { hotelAuthGuard, hotelGuestGuard } from './core/guards/hotel-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [hotelGuestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [hotelGuestGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [hotelAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./features/reservations/reservations.component').then(
            (m) => m.ReservationsComponent,
          ),
      },
      {
        path: 'reservations/:id',
        loadComponent: () =>
          import('./features/reservation-detail/reservation-detail.component').then(
            (m) => m.ReservationDetailComponent,
          ),
      },
      {
        path: 'rooms',
        loadComponent: () =>
          import('./features/rooms/rooms.component').then((m) => m.RoomsComponent),
      },
      {
        path: 'tariffs',
        loadComponent: () =>
          import('./features/tariffs/tariffs.component').then((m) => m.TariffsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
