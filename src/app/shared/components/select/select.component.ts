import {
  Component, ElementRef,
  EventEmitter,
  forwardRef, HostListener, inject,
  Input,
  Output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() placeholder = 'Select...';

  @Output() selectedChange = new EventEmitter<any>();

  private elRef = inject(ElementRef);

  selected = signal<any>(null);
  isOpen = signal(false);

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectOption(option: any, event: Event) {
    event.stopPropagation();
    this.selected.set(option);
    this.selectedChange.emit(option);
    this.onChange(option);
    this.onTouched();
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  writeValue(value: any): void {
    this.selected.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
