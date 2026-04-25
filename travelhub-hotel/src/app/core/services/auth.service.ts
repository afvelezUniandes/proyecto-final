import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, SignInRequest, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'th_hotel_token';
  private readonly USER_KEY = 'th_hotel_user';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _user = signal<User | null>(this.loadUser());

  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());
  readonly token = computed(() => this._token());
  readonly isHotelAdmin = computed(() => this._user()?.rol === 'hotel');

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  setToken(token: string): void {
    this._token.set(token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  login(req: SignInRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/sign-in', req).pipe(
      tap((res) => {
        this._token.set(res.token);
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.fetchProfile();
      }),
    );
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  fetchProfile(): void {
    this.api.get<User>('/auth/profile').subscribe({
      next: (user) => {
        this._user.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        if (user.rol !== 'hotel') {
          this.logout();
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => this.logout(),
    });
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
