import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, LanguageSelectorComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  userInitials(): string {
    const user = this.auth.currentUser();
    if (!user) return 'U';
    const name: string = (user as any)['nombre'] || (user as any)['email'] || '';
    return (
      name
        .split(' ')
        .slice(0, 2)
        .map((p: string) => p[0])
        .join('')
        .toUpperCase() || 'U'
    );
  }
}
