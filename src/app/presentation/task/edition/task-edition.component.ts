import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';

import { Priority, Task } from '@kb/core/task';

import { AuthorComponent } from '../../author/author.component';
import { EditableContentComponent } from '../../editable-content/editable-content.component';
import { IconComponent } from '../../icon/icon.component';
import { PriorityComponent } from '../../priority/priority.component';
import { MenuItemDirective, MenuTriggerDirective } from '../../utils/menu';

@Component({
  selector: 'app-task-edition',
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
  templateUrl: './task-edition.component.html',
  styleUrls: ['./task-edition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditionComponent implements OnInit {
  task = input.required<Task>();
  @Output() updated = new EventEmitter<Task>();
  @Output() canceled = new EventEmitter<void>();

  title = signal('');
  priority = signal<Priority>('low');

  ngOnInit(): void {
    const task = this.task();
    this.title.set(task.title);
    this.priority.set(task.priority);
  }

  confirm(): void {
    const task = this.task();
    task.title = this.title();
    task.priority = this.priority();
    this.updated.emit(task);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.confirm();
    } else if (event.key === 'Escape') {
      this.canceled.emit();
    }
  }
}
