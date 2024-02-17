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

import { Status, Task } from '@kb/core/task';

import { TaskCreationComponent } from './creation/task-creation.component';
import { TaskEditionComponent } from './edition/task-edition.component';
import { TaskReadComponent } from './read/task-read.component';

@Component({
  selector: '[app-task]',
  standalone: true,
  imports: [CommonModule, TaskCreationComponent, TaskEditionComponent, TaskReadComponent],
  template: `@if (displayRead()) {
      <app-task-read
        [task]="task()!"
        (edit)="enableEdition.set(true)"
        (statusChanged)="statusChanged.emit($event)"
        (deleted)="deleted.emit()"
      ></app-task-read>
    } @else if (displayEdit()) {
      <app-task-edition
        [task]="task()!"
        (canceled)="enableEdition.set(false)"
        (updated)="confirmUpdate($event)"
      ></app-task-edition>
    } @else {
      <app-task-creation
        (created)="created.emit($event)"
        (canceled)="creationCanceled.emit()"
      ></app-task-creation>
    } `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  @Output() created = new EventEmitter<Pick<Task, 'title' | 'priority'>>();
  @Output() creationCanceled = new EventEmitter<void>();
  @Output() updated = new EventEmitter<Task>();
  @Output() statusChanged = new EventEmitter<Status>();
  @Output() deleted = new EventEmitter<void>();

  task = input<Task | null>();

  enableEdition = signal(false);

  displayRead = computed(() => !!this.task() && this.enableEdition() === false);
  displayEdit = computed(() => !!this.task() && this.enableEdition() === true);

  confirmUpdate(update: Task): void {
    this.updated.emit(update);
    this.enableEdition.set(false);
  }
}
