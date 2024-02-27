import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  signal,
} from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { OutsideClickDirective } from '../utils/outside-click/outside-click.directive';

export type Choice<T> = {
  value: T;
  label: string;
};

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, IconComponent, OutsideClickDirective],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T> {
  @Output() changed = new EventEmitter<T[]>();

  value = input.required<T[]>();
  choices = input.required<Array<Choice<T>>>();
  placeholder = input('Sélectionnez une ou plusieurs valeurs...');

  isOpen = signal(false);

  displayPlaceholder = computed(() => this.value().length === 0);
  selection = computed(() =>
    this.value().map((item) => this.choices().find((choice) => choice.value === item)),
  );

  select(item: T): void {
    if (this.value().includes(item)) {
      return;
    }

    this.changed.emit([...this.value(), item]);
  }

  remove(index: number): void {
    this.changed.emit(this.value().toSpliced(index, 1));
  }
}
