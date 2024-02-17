import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, model, signal } from '@angular/core';

import { Status, Statuses, Task, TasksStore } from '@kb/core';

import { IconComponent } from '../icon/icon.component';
import { TaskComponent } from '../task/task.component';
import { MenuItemDirective, MenuTriggerDirective } from '../utils/menu';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    IconComponent,
    TaskComponent,
    MenuTriggerDirective,
    MenuItemDirective,
  ],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent {
  status = model.required<Status>();
  displayStatusPicker = input<boolean>(false);

  tasks: Task[] = [];

  statusChoices = Statuses;
  displayTaskCreation = signal(false);

  constructor(private store: TasksStore) {
    effect(() => {
      this.tasks = this.store.selectByStatus(this.status())();
    });
  }

  drop(event: CdkDragDrop<Task[], Task[], Task>): void {
    if (event.container === event.previousContainer) {
      return;
    }
    this.store.updateStatus(event.item.data.id, this.status());
  }

  addTask(data: Pick<Task, 'title' | 'priority'>): void {
    this.store.addTask({
      title: data.title,
      author: {
        id: 'ulrichf',
        name: 'Ulrich Francomme',
        email: 'ulrich@francomme.re',
      },
      status: this.status(),
      priority: data.priority,
    });

    this.displayTaskCreation.set(false);
  }

  changeColumnStatus(status: Status) {
    this.status.set(status);
  }

  updateTask(task: Task): void {
    this.store.updateTask(task);
  }

  updateTaskStatus(status: Status, taskId: string): void {
    this.store.updateStatus(taskId, status);
  }

  deleteTask(taskId: string): void {
    this.store.deleteTask(taskId);
  }
}
