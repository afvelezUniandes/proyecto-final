import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'travelhub_lang';
const DEFAULT_LANG: Lang = 'es';
const SUPPORTED: Lang[] = ['es', 'en'];

@Injectable({ providedIn: 'root' })
export class LangService {
  readonly currentLang = signal<Lang>(this._loadSaved());

  constructor(private translate: TranslateService) {
    this.translate.addLangs(SUPPORTED);
    this.translate.setDefaultLang(DEFAULT_LANG);
    this.translate.use(this.currentLang());
    document.documentElement.lang = this.currentLang();
  }

  setLang(lang: Lang): void {
    if (!SUPPORTED.includes(lang)) return;
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  private _loadSaved(): Lang {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return saved && SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
  }
}
