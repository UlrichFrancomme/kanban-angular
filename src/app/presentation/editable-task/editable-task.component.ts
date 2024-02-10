import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';

import { Priority, Task } from '@kb/core/task';

import { EditableContentComponent } from '../editable-content/editable-content.component';
import { IconComponent } from '../icon/icon.component';
import { PriorityComponent } from '../priority/priority.component';

@Component({
  selector: '[app-editable-task]',
  standalone: true,
  imports: [CommonModule, PriorityComponent, IconComponent, EditableContentComponent],
  templateUrl: './editable-task.component.html',
  styleUrls: ['./editable-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableTaskComponent {
  @Output() canceled = new EventEmitter<void>();
  @Output() created = new EventEmitter<Pick<Task, 'title' | 'priority'>>();

  priority = signal<Priority>('low');
  title = signal<string>('');

  confirm(): void {
    if (this.title().length) {
      this.created.emit({ priority: this.priority(), title: this.title() });
    }
  }
}
