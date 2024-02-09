import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { faker } from '@faker-js/faker';
import { Task, Statuses, Priorities } from '../task/task';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskComponent],
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnComponent {
  tasks = signal<Task[]>(new Array(30).fill(null).map(() => ({
    id: faker.string.nanoid(),
    title: faker.lorem.sentence(),
    author: {
      id: faker.string.nanoid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
    },
    status: 'in_progress',
    priority: faker.helpers.arrayElement(Priorities),
  })));

  drop(event: CdkDragDrop<Task[]>) {
    this.tasks.update((tasks) => {
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
      return tasks;
    });
  }
}
