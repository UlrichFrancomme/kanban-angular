import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input({ required: true }) priority!: Priority;
  @Output() updated = new EventEmitter<Priority>();

  choices = Priorities;
  choicesDisplayed = false;

  select(choice: Priority): void {
    this.updated.emit(choice);
    this.choicesDisplayed = false;
  }
}
