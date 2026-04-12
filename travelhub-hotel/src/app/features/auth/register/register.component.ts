import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  step = signal<1 | 2>(1);
  loading = false;
  error = signal<string | null>(null);
  success = signal(false);

  // Step 1 — Account
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;

  // Step 2 — Hotel
  hotelNombre = '';
  hotelPais = 'Colombia';
  hotelCiudad = '';
  hotelDireccion = '';
  hotelEstrellas = 3;
  hotelTelefono = '';
  hotelEmail = '';

  paises = [
    'Colombia',
    'México',
    'Argentina',
    'Chile',
    'Perú',
    'Ecuador',
    'España',
    'Estados Unidos',
  ];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {}

  nextStep() {
    this.error.set(null);
    if (!this.nombre.trim()) {
      this.error.set('El nombre es requerido.');
      return;
    }
    if (!this.email.trim()) {
      this.error.set('El correo es requerido.');
      return;
    }
    if (this.password.length < 6) {
      this.error.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.step.set(2);
  }

  prevStep() {
    this.error.set(null);
    this.step.set(1);
  }

  onRegister() {
    this.error.set(null);
    if (!this.hotelNombre.trim()) {
      this.error.set('El nombre del hotel es requerido.');
      return;
    }
    if (!this.hotelCiudad.trim()) {
      this.error.set('La ciudad es requerida.');
      return;
    }
    if (!this.hotelDireccion.trim()) {
      this.error.set('La dirección es requerida.');
      return;
    }

    this.loading = true;

    this.api
      .post('/auth/sign-up', {
        nombre: this.nombre.trim(),
        email: this.email.trim(),
        password: this.password,
        rol: 'hotel',
        hotel: {
          nombre: this.hotelNombre.trim(),
          pais: this.hotelPais,
          ciudad: this.hotelCiudad.trim(),
          direccion: this.hotelDireccion.trim(),
          estrellas: this.hotelEstrellas,
          telefono: this.hotelTelefono.trim(),
          email: this.hotelEmail.trim() || this.email.trim(),
        },
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.success.set(true);
        },
        error: (err) => {
          this.loading = false;
          if (err?.status === 409) {
            this.error.set('Ya existe una cuenta con ese correo.');
            this.step.set(1);
          } else {
            this.error.set('Error al crear la cuenta. Intenta de nuevo.');
          }
        },
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
