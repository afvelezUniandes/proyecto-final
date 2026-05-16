import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'input[appDatePicker]',
  standalone: true,
})
export class DatePickerDirective implements AfterViewInit, OnDestroy, OnChanges {
  @Input() fpMin?: string;
  @Input() fpMax?: string;

  private fp: ReturnType<typeof flatpickr> | null = null;
  private sub!: Subscription;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private translate: TranslateService,
  ) {}

  ngAfterViewInit() {
    const inputClass = this.el.nativeElement.className;
    this.initFlatpickr(inputClass);

    // Pick up value already set by ngModel before this hook ran
    setTimeout(() => {
      const val = this.el.nativeElement.value;
      if (val) (this.fp as any)?.setDate(val, false);
    }, 0);

    this.sub = this.translate.onLangChange.subscribe(() => {
      const val = this.el.nativeElement.value;
      this.destroy();
      this.initFlatpickr(inputClass);
      if (val) (this.fp as any)?.setDate(val, false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fpMin'] && this.fp) {
      (this.fp as any).set('minDate', this.fpMin || undefined);
    }
    if (changes['fpMax'] && this.fp) {
      (this.fp as any).set('maxDate', this.fpMax || undefined);
    }
  }

  private initFlatpickr(altInputClass: string) {
    const isEn = this.translate.currentLang === 'en';
    this.fp = flatpickr(this.el.nativeElement, {
      locale: isEn ? 'default' : Spanish,
      dateFormat: 'Y-m-d',
      altInput: true,
      altFormat: isEn ? 'm/d/Y' : 'd/m/Y',
      altInputClass,
      minDate: this.fpMin || undefined,
      maxDate: this.fpMax || undefined,
      disableMobile: true,
      onChange: (_dates, dateStr) => {
        this.el.nativeElement.value = dateStr;
        this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      },
    });
  }

  private destroy() {
    if (this.fp) {
      (this.fp as any).destroy?.();
      this.fp = null;
    }
  }

  ngOnDestroy() {
    this.destroy();
    this.sub?.unsubscribe();
  }
}
