import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';

import { Priority, Status, Statuses, Task } from '@kb/core/task';

import { AuthorComponent } from './author/author.component';
import { IconComponent } from '../icon/icon.component';
import { PriorityComponent } from '../priority/priority.component';
import { MenuTriggerDirective } from '../utils/menu/menu.directive';

@Component({
  selector: '[app-task]',
  standalone: true,
  imports: [CommonModule, IconComponent, PriorityComponent, AuthorComponent, MenuTriggerDirective],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  task = input.required<Task>();
  @Output() deleted = new EventEmitter<string>();
  @Output() prorityChanged = new EventEmitter<Priority>();
  @Output() statusChanged = new EventEmitter<Status>();

  availableStatuses = computed(() => Statuses.filter((status) => status !== this.task().status));

  changePriority(priority: Priority): void {
    this.prorityChanged.emit(priority);
  }

  changeStatus(status: Status): void {
    this.statusChanged.emit(status);
  }
}
