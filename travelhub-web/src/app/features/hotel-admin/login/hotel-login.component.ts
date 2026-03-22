import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HotelAdminService } from '../../../core/services/hotel-admin.service';

type Step = 'login' | 'register-user' | 'register-hotel';

@Component({
  selector: 'app-hotel-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
      this.regError.set('Por favor completa todos los campos.');
      return;
    }
    if (this.regPassword.length < 6) {
      this.regError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.regPassword !== this.regConfirm) {
      this.regError.set('Las contraseñas no coinciden.');
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
      this.loginError.set('Por favor completa todos los campos.');
      return;
    }
    this.loginLoading = true;
    this.auth.login({ email: this.loginEmail.trim(), password: this.loginPassword }).subscribe({
      next: () => {
        this.auth.fetchProfile();
        setTimeout(() => {
          const user = this.auth.currentUser();
          if (user?.rol !== 'hotel') {
            this.loginLoading = false;
            this.loginError.set('Esta cuenta no es de tipo hotel.');
            this.auth.logout();
            return;
          }
          this.router.navigate(['/hotel/dashboard']);
        }, 500);
      },
      error: (err) => {
        this.loginLoading = false;
        this.loginError.set(
          err?.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'Error al conectar. Intenta de nuevo.',
        );
      },
    });
  }

  onRegister() {
    this.regError.set(null);
    this.regSuccess.set(null);
    if (!this.regHotelNombre || !this.regCiudad || !this.regPais) {
      this.regError.set('Por favor completa todos los campos obligatorios.');
      return;
    }
    this.regLoading = true;
    this.auth.register({
      nombre: this.regNombre.trim(),
      email: this.regEmail.trim(),
      password: this.regPassword,
      rol: 'hotel',
    }).subscribe({
      next: () => {
        this.auth.login({ email: this.regEmail.trim(), password: this.regPassword }).subscribe({
          next: () => {
            this.auth.fetchProfile();
            this.hotelAdmin.createHotel({
              nombre: this.regHotelNombre.trim(),
              ciudad: this.regCiudad.trim(),
              pais: this.regPais.trim(),
              direccion: this.regDireccion.trim(),
              descripcion: this.regDescripcion.trim(),
            }).subscribe({
              next: () => {
                this.regLoading = false;
                this.regSuccess.set('Hotel registrado correctamente.');
                setTimeout(() => this.router.navigate(['/hotel/dashboard']), 1000);
              },
              error: () => {
                this.regLoading = false;
                this.regError.set('Cuenta creada pero error al registrar el hotel.');
              },
            });
          },
          error: () => {
            this.regLoading = false;
            this.regError.set('Cuenta creada. Inicia sesión para continuar.');
            this.goToLogin();
          },
        });
      },
      error: (err) => {
        this.regLoading = false;
        this.regError.set(
          err?.status === 400
            ? 'Este correo ya está registrado.'
            : 'Error al registrar. Intenta de nuevo.',
        );
      },
    });
  }
}
