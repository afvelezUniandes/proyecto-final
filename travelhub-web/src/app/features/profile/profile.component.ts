import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { AuthService } from '../../core/services/auth.service';

const MOCK_USER = {
  id: 1,
  nombre: 'Andrés Vélez',
  email: 'andres.velez@email.com',
  telefono: '+57 310 456 7890',
  pais: 'Colombia',
  idioma_preferido: 'es',
  rol: 'viajero',
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user = signal(MOCK_USER);
  editing = signal(false);
  saveSuccess = false;

  draft = { ...MOCK_USER };

  constructor(public auth: AuthService) {
    const current = auth.currentUser();
    if (current) {
      const merged = { ...MOCK_USER, ...current };
      this.user.set(merged as typeof MOCK_USER);
      this.draft = { ...merged } as typeof MOCK_USER;
    }
  }

  startEdit() {
    this.draft = { ...this.user() };
    this.editing.set(true);
    this.saveSuccess = false;
  }

  save() {
    this.user.set({ ...this.draft });
    this.editing.set(false);
    this.saveSuccess = true;
    setTimeout(() => (this.saveSuccess = false), 3000);
  }

  cancel() {
    this.editing.set(false);
  }

  initials(): string {
    return this.user()
      .nombre.split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  logout() {
    this.auth.logout();
  }
}
