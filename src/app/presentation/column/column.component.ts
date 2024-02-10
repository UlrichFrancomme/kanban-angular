import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal, signal } from '@angular/core';
import { Status, Task } from '../../core/task';
import { TasksStore } from '../../core/tasks.store';
import { faker } from '@faker-js/faker';
import { TaskComponent } from '../task/task.component';
import { EditableTaskComponent } from '../editable-task/editable-task.component';


@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskComponent, EditableTaskComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent {
  @Input({ required: true }) status!: Status;
  tasks!: Signal<Task[]>;

  editableTaskDisplayed = signal(false);

  constructor(private store: TasksStore) {
  }

  ngOnInit() {
    this.tasks = this.store.selectByStatus(this.status);
  }

  drop(event: CdkDragDrop<Task[], Task[], Task>) {
    if (event.container === event.previousContainer) {
      return;
    }
    this.store.changeTaskStatus(event.item.data.id, this.status);
  }

  addTask(data: Pick<Task, 'title' | 'priority'>) {
    this.store.addTask({
      title: data.title,
      author: {
        id: faker.string.nanoid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
      status: this.status,
      priority: data.priority
    });

    this.editableTaskDisplayed.set(false);
  }
}
