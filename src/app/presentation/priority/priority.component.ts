import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, model } from '@angular/core';

import { Priorities, Priority } from '@kb/core';

@Component({
  selector: 'app-priority',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityComponent {
  priority = model.required<Priority>();
  selectionOpened = model(false);

  choices = Priorities;

  select(priority: Priority): void {
    this.priority.set(priority);
    this.selectionOpened.set(false);
  }
}
