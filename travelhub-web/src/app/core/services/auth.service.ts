import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, SignInRequest, SignUpRequest, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'th_token';
  private readonly USER_KEY = 'th_user';

  private _token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  private _user = signal<User | null>(this.loadUser());

  readonly isLoggedIn = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());
  readonly token = computed(() => this._token());

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  login(req: SignInRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/sign-in', req).pipe(
      tap((res) => {
        this._token.set(res.token);
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.fetchProfile();
      }),
    );
  }

  register(req: SignUpRequest): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/auth/sign-up', req);
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
      },
      error: () => {},
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
