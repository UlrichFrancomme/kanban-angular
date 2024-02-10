import { Injectable, Signal, computed, signal } from '@angular/core';
import { Priorities, Status, Statuses, Task } from './task';

import { faker } from '@faker-js/faker';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private tasks = signal<Task[]>(new Array(100).fill(null).map(() => ({
    id: faker.string.nanoid(),
    title: faker.lorem.sentence(),
    author: {
      id: faker.string.nanoid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
    },
    status: faker.helpers.arrayElement(Statuses),
    priority: faker.helpers.arrayElement(Priorities),
  })), { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) });


  selectByStatus(status: Status): Signal<Task[]> {
    return computed(() => {
      return this.tasks()
        .filter((item) => item.status === status)
        .toSorted(this.compareFn.bind(this));
    });
  }

  private compareFn(a: Task, b: Task): number {
    if (a.priority === b.priority) {
      return 0;
    }

    if (a.priority === 'low' || (a.priority === 'medium' && b.priority !== 'low') || (a.priority === 'high' && b.priority === 'critical')) {
      return 1;
    }

    if (b.priority === 'low' || b.priority === 'medium' || (b.priority === 'high' && a.priority === 'critical')) {
      return -1;
    }

    return 0;
  }

  changeTaskStatus(taskId: string, status: Status): void {
    this.tasks.update((tasks) => {
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      const [foundTask] = tasks.splice(taskIndex, 1);
      if (foundTask) {
        foundTask.status = status;
        return [...tasks, foundTask];
      }
      return tasks;
    });
  }

  changeTaskOrder(taskId: string, status: Status): void {
    this.tasks.update((tasks) => {
      const foundTask = tasks.find((task) => task.id === taskId);
      if (foundTask) {
        foundTask.status = status;
      }
      return tasks;
    });
  }
}