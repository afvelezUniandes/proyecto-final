import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageSelectorComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = signal<string | null>(null);
  showPassword = false;

  features = [
    {
      icon: '📊',
      title: 'Dashboard en tiempo real',
      desc: 'Ocupación, ingresos y reservas al instante',
    },
    {
      icon: '💰',
      title: 'Gestión de tarifas flexible',
      desc: 'Actualiza precios por temporada y demanda',
    },
    {
      icon: '📋',
      title: 'Control total de reservas',
      desc: 'Filtra, busca y gestiona cada reserva',
    },
  ];

  constructor(private auth: AuthService) {}

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
