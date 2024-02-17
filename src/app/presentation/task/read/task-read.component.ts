import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';

import { Status, Statuses, Task } from '@kb/core/task';

import { AuthorComponent } from '../../author/author.component';
import { EditableContentComponent } from '../../editable-content/editable-content.component';
import { IconComponent } from '../../icon/icon.component';
import { PriorityComponent } from '../../priority/priority.component';
import { MenuItemDirective, MenuTriggerDirective } from '../../utils/menu';

@Component({
  selector: 'app-task-read',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    PriorityComponent,
    AuthorComponent,
    MenuTriggerDirective,
    MenuItemDirective,
    EditableContentComponent,
  ],
  templateUrl: './task-read.component.html',
  styleUrls: ['./task-read.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskReadComponent {
  task = input.required<Task>();
  @Output() edit = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<Status>();

  availableStatuses = computed(() => Statuses.filter((status) => status !== this.task().status));
}
