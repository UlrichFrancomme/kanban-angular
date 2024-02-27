import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

import { Priority, TaskStore } from '../../core';
import { Choice, DropdownComponent } from '../dropdown/dropdown.component';
import { TextfieldComponent } from '../textfield/textfield.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, DropdownComponent, TextfieldComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  title = signal<string>('');
  priorities = signal<Priority[]>([]);
  authors = signal<string[]>([]);

  prioritiesChoices: Array<Choice<Priority>> = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  constructor(private store: TaskStore) {
    effect(
      () => {
        this.store.updateFilters({
          title: this.title(),
          authors: this.authors(),
          priorities: this.priorities(),
        });
      },
      { allowSignalWrites: true },
    );
  }
}
