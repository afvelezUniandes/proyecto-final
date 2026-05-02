import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent, TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = signal<string | null>(null);
  showPassword = false;

  get features() {
    return [
      {
        icon: '📊',
        title: this.translate.instant('AUTH.SIDE_DASHBOARD'),
        desc: this.translate.instant('AUTH.SIDE_DASHBOARD_SUB'),
      },
      {
        icon: '💰',
        title: this.translate.instant('AUTH.SIDE_TARIFFS'),
        desc: this.translate.instant('AUTH.SIDE_TARIFFS_SUB'),
      },
      {
        icon: '📋',
        title: this.translate.instant('AUTH.SIDE_CONTROL'),
        desc: this.translate.instant('AUTH.SIDE_CONTROL_SUB'),
      },
    ];
  }

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
  ) {}

  onLogin() {
    this.error.set(null);
    if (!this.email || !this.password) {
      this.error.set('Por favor completa todos los campos.');
      return;
    }
    this.loading = true;
    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      error: (err) => {
        this.loading = false;
        if (err?.status === 401) {
          this.error.set('Credenciales incorrectas.');
        } else if (err?.status === 403) {
          this.error.set('Esta cuenta no tiene acceso al portal de hoteles.');
        } else {
          this.error.set('Error al conectar. Intenta de nuevo.');
        }
      },
    });
  }
}
