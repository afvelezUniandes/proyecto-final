import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSelectorComponent } from '../../../shared/language-selector/language-selector.component';

type Tab = 'login' | 'register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageSelectorComponent, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  tab = signal<Tab>('login');

  // Login
  loginEmail = '';
  loginPassword = '';
  loginLoading = false;
  loginError = signal<string | null>(null);
  showPassword = false;

  // Register
  registerNombre = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirm = '';
  registerLoading = false;
  registerError = signal<string | null>(null);
  registerSuccess = signal<string | null>(null);
  showRegisterPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  setTab(t: Tab) {
    this.tab.set(t);
    this.loginError.set(null);
    this.registerError.set(null);
    this.registerSuccess.set(null);
  }

  onLogin() {
    this.loginError.set(null);
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError.set(this.translate.instant('AUTH.ERR_EMPTY_FIELDS'));
      return;
    }
    this.loginLoading = true;
    this.auth.login({ email: this.loginEmail.trim(), password: this.loginPassword }).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.loginLoading = false;
        const status = err?.status;
        this.loginError.set(
          status === 401
            ? this.translate.instant('AUTH.ERR_WRONG_CREDENTIALS')
            : this.translate.instant('AUTH.ERR_CONNECT'),
        );
      },
    });
  }

  onRegister() {
    this.registerError.set(null);
    this.registerSuccess.set(null);
    if (
      !this.registerNombre ||
      !this.registerEmail ||
      !this.registerPassword ||
      !this.registerConfirm
    ) {
      this.registerError.set(this.translate.instant('AUTH.ERR_EMPTY_FIELDS'));
      return;
    }
    const emailRe = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRe.test(this.registerEmail.trim())) {
      this.registerError.set(this.translate.instant('AUTH.ERR_INVALID_EMAIL'));
      return;
    }
    const passwordRe = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRe.test(this.registerPassword)) {
      this.registerError.set(this.translate.instant('AUTH.ERR_WEAK_PASSWORD'));
      return;
    }
    if (this.registerPassword !== this.registerConfirm) {
      this.registerError.set(this.translate.instant('AUTH.ERR_PASSWORD_MISMATCH'));
      return;
    }
    this.registerLoading = true;
    this.auth
      .register({
        nombre: this.registerNombre.trim(),
        email: this.registerEmail.trim(),
        password: this.registerPassword,
      })
      .subscribe({
        next: () => {
          this.registerLoading = false;
          this.registerSuccess.set(this.translate.instant('AUTH.SUCCESS_REGISTER'));
          setTimeout(() => this.setTab('login'), 1500);
        },
        error: (err) => {
          this.registerLoading = false;
          this.registerError.set(
            err?.status === 409
              ? this.translate.instant('AUTH.ERR_EMAIL_TAKEN')
              : this.translate.instant('AUTH.ERR_REGISTER'),
          );
        },
      });
  }
}
