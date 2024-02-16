import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
  Signal,
} from '@angular/core';

import { Priority, Status, Task, TasksStore } from '@kb/core';

import { EditableTaskComponent } from '../editable-task/editable-task.component';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, TaskComponent, EditableTaskComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent implements OnInit {
  status = input.required<Status>();
  tasks!: Signal<Task[]>;

  editableTaskDisplayed = signal(false);

  constructor(private store: TasksStore) {}

  ngOnInit() {
    this.tasks = computed(() => this.store.selectByStatus(this.status()))();
  }

  drop(event: CdkDragDrop<Task[], Task[], Task>) {
    if (event.container === event.previousContainer) {
      return;
    }
    this.store.updateStatus(event.item.data.id, this.status());
  }

  addTask(data: Pick<Task, 'title' | 'priority'>) {
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

    this.editableTaskDisplayed.set(false);
  }

  changePriority(priority: Priority, taskId: string) {
    this.store.updatePriority(taskId, priority);
  }

  changeStatus(status: Status, taskId: string) {
    this.store.updateStatus(taskId, status);
  }
}
