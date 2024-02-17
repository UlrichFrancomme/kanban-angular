import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Output,
  signal,
} from '@angular/core';

import { Priority, Task } from '@kb/core/task';

import { EditableContentComponent } from '../../editable-content/editable-content.component';
import { IconComponent } from '../../icon/icon.component';
import { PriorityComponent } from '../../priority/priority.component';

@Component({
  selector: 'app-task-creation',
  standalone: true,
  imports: [CommonModule, PriorityComponent, IconComponent, EditableContentComponent],
  templateUrl: './task-creation.component.html',
  styleUrls: ['./task-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreationComponent {
  @Output() canceled = new EventEmitter<void>();
  @Output() created = new EventEmitter<Pick<Task, 'title' | 'priority'>>();

  priority = signal<Priority>('low');
  title = signal<string>('');

  confirm(): void {
    console.log('confirm');
    if (this.title().length) {
      this.created.emit({ priority: this.priority(), title: this.title() });
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    console.log('keydown');
    if (event.key === 'Enter') {
      this.confirm();
    } else if (event.key === 'Escape') {
      this.canceled.emit();
    }
  }
}
