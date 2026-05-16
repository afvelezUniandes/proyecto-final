import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';

type Step = 'login' | 'register-user' | 'register-hotel';

@Component({
  selector: 'app-hotel-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './hotel-login.component.html',
})
export class HotelLoginComponent {
  step = signal<Step>('login');

  loginEmail = '';
  loginPassword = '';
  loginLoading = false;
  loginError = signal<string | null>(null);

  regNombre = '';
  regEmail = '';
  regPassword = '';
  regConfirm = '';
  regHotelNombre = '';
  regCiudad = '';
  regPais = '';
  regDireccion = '';
  regDescripcion = '';
  regLoading = false;
  regError = signal<string | null>(null);
  regSuccess = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private hotelAdmin: HotelAdminService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  goToRegister() {
    this.step.set('register-user');
    this.loginError.set(null);
    this.regError.set(null);
    this.regSuccess.set(null);
  }

  goToLogin() {
    this.step.set('login');
    this.loginError.set(null);
    this.regError.set(null);
  }

  goToStep2() {
    this.regError.set(null);
    if (!this.regNombre || !this.regEmail || !this.regPassword || !this.regConfirm) {
      this.regError.set(this.translate.instant('HOTEL_ADMIN.ERR_EMPTY'));
      return;
    }
    if (this.regPassword.length < 6) {
      this.regError.set(this.translate.instant('HOTEL_ADMIN.ERR_SHORT_PASS'));
      return;
    }
    if (this.regPassword !== this.regConfirm) {
      this.regError.set(this.translate.instant('HOTEL_ADMIN.ERR_MISMATCH'));
      return;
    }
    this.step.set('register-hotel');
  }

  goBackToStep1() {
    this.step.set('register-user');
    this.regError.set(null);
  }

  onLogin() {
    this.loginError.set(null);
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError.set(this.translate.instant('HOTEL_ADMIN.ERR_EMPTY'));
      return;
    }
    this.loginLoading = true;
    this.auth.login({ email: this.loginEmail.trim(), password: this.loginPassword }).subscribe({
      next: () => {
        this.auth.fetchProfile().subscribe({
          next: (user) => {
            this.loginLoading = false;
            if (user?.rol !== 'hotel') {
              this.loginError.set(this.translate.instant('HOTEL_ADMIN.ERR_NOT_HOTEL'));
              this.auth.logout();
              return;
            }
            this.router.navigate(['/hotel/dashboard']);
          },
          error: () => {
            this.loginLoading = false;
            this.loginError.set(this.translate.instant('HOTEL_ADMIN.ERR_CONNECT'));
          },
        });
      },
      error: (err) => {
        this.loginLoading = false;
        this.loginError.set(
          err?.status === 401
            ? this.translate.instant('HOTEL_ADMIN.ERR_CREDENTIALS')
            : this.translate.instant('HOTEL_ADMIN.ERR_CONNECT'),
        );
      },
    });
  }

  onRegister() {
    this.regError.set(null);
    this.regSuccess.set(null);
    if (!this.regHotelNombre || !this.regCiudad || !this.regPais) {
      this.regError.set(this.translate.instant('HOTEL_ADMIN.ERR_REQUIRED_FIELDS'));
      return;
    }
    this.regLoading = true;
    this.auth
      .register({
        nombre: this.regNombre.trim(),
        email: this.regEmail.trim(),
        password: this.regPassword,
        rol: 'hotel',
      })
      .subscribe({
        next: () => {
          this.auth.login({ email: this.regEmail.trim(), password: this.regPassword }).subscribe({
            next: () => {
              this.auth.fetchProfile().subscribe();
              this.hotelAdmin
                .createHotel({
                  nombre: this.regHotelNombre.trim(),
                  ciudad: this.regCiudad.trim(),
                  pais: this.regPais.trim(),
                  direccion: this.regDireccion.trim(),
                  descripcion: this.regDescripcion.trim(),
                })
                .subscribe({
                  next: () => {
                    this.regLoading = false;
                    this.regSuccess.set(this.translate.instant('HOTEL_ADMIN.SUCCESS_ACCOUNT'));
                    setTimeout(() => this.router.navigate(['/hotel/dashboard']), 1000);
                  },
                  error: () => {
                    this.regLoading = false;
                    this.regError.set(this.translate.instant('HOTEL_ADMIN.ERR_HOTEL_REGISTER'));
                  },
                });
            },
            error: () => {
              this.regLoading = false;
              this.regError.set(this.translate.instant('HOTEL_ADMIN.ERR_REGISTER'));
              this.goToLogin();
            },
          });
        },
        error: (err) => {
          this.regLoading = false;
          this.regError.set(
            err?.status === 409
              ? this.translate.instant('HOTEL_ADMIN.ERR_EMAIL_TAKEN')
              : this.translate.instant('HOTEL_ADMIN.ERR_REGISTER'),
          );
        },
      });
  }
}
