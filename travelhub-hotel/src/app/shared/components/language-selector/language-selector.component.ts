import { Component, computed, input, HostListener, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { LangService } from '../../../core/services/lang.service';

export type Lang = 'es' | 'en';
type Theme = 'dark' | 'light';

const LANGS: Record<Lang, { flagCode: string; label: string }> = {
  es: { flagCode: 'es', label: 'ES' },
  en: { flagCode: 'us', label: 'EN' },
};

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        (click)="open = !open"
        [class]="btnClass()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open"
        [attr.aria-label]="'Idioma: ' + langs[current()].label"
      >
        <span class="fi" [ngClass]="'fi-' + langs[current()].flagCode" aria-hidden="true"></span>
        <span>{{ langs[current()].label }}</span>
        <svg
          class="w-3 h-3 transition-transform"
          [class.rotate-180]="open"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      @if (open) {
        <div class="fixed inset-0 z-10" (click)="open = false"></div>
        <ul
          role="listbox"
          class="absolute right-0 mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-32 list-none p-0 m-0"
        >
          @for (entry of langEntries; track entry.key) {
            <li role="option" [attr.aria-selected]="current() === entry.key">
              <button
                (click)="select(entry.key)"
                class="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                [class.font-semibold]="current() === entry.key"
                [class.text-blue-700]="current() === entry.key"
              >
                <span class="fi" [ngClass]="'fi-' + entry.flagCode" aria-hidden="true"></span>
                <span>{{ entry.full }}</span>
                @if (current() === entry.key) {
                  <span class="ml-auto text-blue-600" aria-hidden="true">✓</span>
                }
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class LanguageSelectorComponent {
  theme = input<Theme>('dark');
  langs = LANGS;
  open = false;
  private doc = inject(DOCUMENT);

  langEntries = [
    { key: 'es' as Lang, flagCode: 'es', full: 'Español' },
    { key: 'en' as Lang, flagCode: 'us', full: 'English' },
  ];

  constructor(public langService: LangService) {}

  current = computed(() => this.langService.currentLang());

  @HostListener('document:keydown.escape')
  onEscape() {
    this.open = false;
  }

  btnClass(): string {
    const base =
      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border';
    if (this.theme() === 'light') {
      return `${base} text-white bg-travelBlue-700 border-travelBlue-700 hover:bg-travelBlue-800 hover:border-travelBlue-800`;
    }
    return `${base} text-white/80 border-white/20 hover:text-white hover:bg-white/10`;
  }

  select(lang: Lang) {
    this.langService.setLang(lang);
    this.doc.documentElement.lang = lang;
    this.open = false;
  }
}
