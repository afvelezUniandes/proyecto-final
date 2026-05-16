import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent, TranslateModule],
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
  hotelDescripcion = '';
  hotelImageFile: File | null = null;
  hotelImagePreview: string | null = null;

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
    private translate: TranslateService,
  ) {}

  nextStep() {
    this.error.set(null);
    if (!this.nombre.trim()) {
      this.error.set(this.translate.instant('AUTH.ERR_NAME_REQUIRED'));
      return;
    }
    if (!this.email.trim()) {
      this.error.set(this.translate.instant('AUTH.ERR_EMAIL_REQUIRED'));
      return;
    }
    const passwordRe = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRe.test(this.password)) {
      this.error.set(this.translate.instant('AUTH.ERR_WEAK_PASSWORD'));
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set(this.translate.instant('AUTH.ERR_MISMATCH'));
      return;
    }
    this.step.set(2);
  }

  prevStep() {
    this.error.set(null);
    this.step.set(1);
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.error.set(null);
    if (file.size > 5 * 1024 * 1024) {
      this.error.set(this.translate.instant('AUTH.ERR_IMAGE_SIZE'));
      input.value = '';
      return;
    }
    this.hotelImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => (this.hotelImagePreview = e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onRegister() {
    this.error.set(null);
    if (!this.hotelNombre.trim()) {
      this.error.set(this.translate.instant('AUTH.ERR_HOTEL_NAME'));
      return;
    }
    if (!this.hotelCiudad.trim()) {
      this.error.set(this.translate.instant('AUTH.ERR_CITY'));
      return;
    }
    if (!this.hotelDireccion.trim()) {
      this.error.set(this.translate.instant('AUTH.ERR_ADDRESS'));
      return;
    }

    this.loading = true;

    this.api
      .post<{ message: string; hotel_id: number | null; token?: string; rol?: string }>(
        '/auth/sign-up',
        {
          nombre: this.nombre.trim(),
          email: this.email.trim(),
          password: this.password,
          rol: 'hotel',
          hotel: {
            nombre: this.hotelNombre.trim(),
            pais: this.hotelPais,
            ciudad: this.hotelCiudad.trim(),
            direccion: this.hotelDireccion.trim(),
            descripcion: this.hotelDescripcion.trim(),
            estrellas: this.hotelEstrellas,
            telefono: this.hotelTelefono.trim(),
            email: this.hotelEmail.trim() || this.email.trim(),
          },
        },
      )
      .subscribe({
        next: (res) => {
          if (res.token) {
            this.auth.setToken(res.token);
          }
          if (this.hotelImageFile && res.hotel_id) {
            this.api
              .uploadFile(`/catalog/hotels/${res.hotel_id}/image`, this.hotelImageFile)
              .pipe(
                finalize(() => {
                  this.loading = false;
                  if (res.token) {
                    this.auth.fetchProfile();
                  } else {
                    this.success.set(true);
                  }
                }),
              )
              .subscribe({ error: () => {} });
          } else {
            this.loading = false;
            if (res.token) {
              this.auth.fetchProfile();
            } else {
              this.success.set(true);
            }
          }
        },
        error: (err) => {
          this.loading = false;
          if (err?.status === 409) {
            this.error.set(this.translate.instant('AUTH.ERR_EMAIL_TAKEN'));
            this.step.set(1);
          } else {
            this.error.set(this.translate.instant('AUTH.ERR_CREATE'));
          }
        },
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
