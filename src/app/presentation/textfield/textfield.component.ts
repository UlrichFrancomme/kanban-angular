import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { Icon } from '../icon/icons';

@Component({
  selector: 'app-textfield',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './textfield.component.html',
  styleUrl: './textfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextfieldComponent {
  @Output() changed = new EventEmitter<string>();

  value = input.required<string>();
  placeholder = input('Tapez un texte...');
  icon = input<Icon>();
  clearable = input(false);

  displayPlaceholder = computed(() => this.value().length === 0);
  displayClear = computed(() => this.clearable() && this.value().length > 0);

  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.changed.emit(target.value);
  }

  clear(): void {
    this.changed.emit('');
  }
}
