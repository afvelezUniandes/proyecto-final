import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LanguageSelectorComponent, TranslateModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user = signal<User | null>(null);
  editing = signal(false);
  saveSuccess = false;
  saving = false;

  draft: Partial<User> = {};

  constructor(
    public auth: AuthService,
    private api: ApiService,
  ) {
    const current = auth.currentUser();
    if (current) {
      this.user.set(current);
      this.draft = { ...current };
    }
    auth.fetchProfile().subscribe();
    effect(() => {
      const u = auth.currentUser();
      if (u) {
        this.user.set(u);
        if (!this.editing()) {
          this.draft = { ...u };
        }
      }
    });
  }

  startEdit() {
    this.draft = { ...this.user()! };
    this.editing.set(true);
    this.saveSuccess = false;
  }

  save() {
    this.saving = true;
    this.api
      .put<User>('/auth/profile', {
        nombre: this.draft.nombre,
        telefono: this.draft.telefono,
        pais: this.draft.pais,
        idioma_preferido: this.draft.idioma_preferido,
      })
      .subscribe({
        next: (updated) => {
          this.user.set(updated);
          this.editing.set(false);
          this.saveSuccess = true;
          this.saving = false;
          this.auth.fetchProfile().subscribe();
          setTimeout(() => (this.saveSuccess = false), 3000);
        },
        error: () => {
          this.saving = false;
        },
      });
  }

  cancel() {
    this.editing.set(false);
  }

  initials(): string {
    const u = this.user();
    if (!u || !u.nombre) return 'U';
    return u.nombre
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  logout() {
    this.auth.logout();
  }
}
