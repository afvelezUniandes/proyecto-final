import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Lang = 'es' | 'en';
type Theme = 'dark' | 'light';

const LANGS: Record<Lang, { flag: string; label: string }> = {
  es: { flag: '🇪🇸', label: 'ES' },
  en: { flag: '🇺🇸', label: 'EN' },
};

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        (click)="open.set(!open())"
        [class]="btnClass()"
      >
        <span>{{ langs[current()].flag }}</span>
        <span>{{ langs[current()].label }}</span>
        <svg class="w-3 h-3 transition-transform" [class.rotate-180]="open()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      @if (open()) {
        <div class="fixed inset-0 z-10" (click)="open.set(false)"></div>
        <div class="absolute right-0 mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[128px]">
          @for (entry of langEntries; track entry.key) {
            <button
              (click)="select(entry.key)"
              class="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              [class.font-semibold]="current() === entry.key"
              [class.text-blue-700]="current() === entry.key"
            >
              <span>{{ entry.flag }}</span>
              <span>{{ entry.full }}</span>
              @if (current() === entry.key) {
                <span class="ml-auto text-blue-600">✓</span>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class LanguageSelectorComponent {
  theme = input<Theme>('dark');
  langs = LANGS;
  current = signal<Lang>('es');
  open = signal(false);

  langEntries = [
    { key: 'es' as Lang, flag: '🇪🇸', full: 'Español' },
    { key: 'en' as Lang, flag: '🇺🇸', full: 'English' },
  ];

  btnClass(): string {
    const base = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border';
    if (this.theme() === 'light') {
      return `${base} text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-800`;
    }
    return `${base} text-white/80 border-white/20 hover:text-white hover:bg-white/10`;
  }

  select(lang: Lang) {
    this.current.set(lang);
    this.open.set(false);
  }
}
