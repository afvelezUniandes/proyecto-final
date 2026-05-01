import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { LangService } from './core/services/lang.service';

function initLang(langService: LangService) {
  return () => langService.currentLang();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideTranslateService({ defaultLanguage: 'es' }),
    provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
    {
      provide: APP_INITIALIZER,
      useFactory: initLang,
      deps: [LangService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
