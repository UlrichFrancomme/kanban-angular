import { computed, Injectable, signal, Signal } from '@angular/core';
import { nanoid } from 'nanoid';

import { Priority, Status, Task } from './task';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private tasks = signal<Task[]>([]);

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

    if (
      a.priority === 'low' ||
      (a.priority === 'medium' && b.priority !== 'low') ||
      (a.priority === 'high' && b.priority === 'critical')
    ) {
      return 1;
    }

    if (
      b.priority === 'low' ||
      b.priority === 'medium' ||
      (b.priority === 'high' && a.priority === 'critical')
    ) {
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

  addTask(task: Omit<Task, 'id'>): void {
    this.tasks.update((tasks) => [
      ...tasks,
      {
        id: nanoid(),
        ...task,
      },
    ]);
  }

  deleteTask(taskId: string): void {
    this.tasks.update((tasks) => {
      const taskIndex = tasks.findIndex((item) => item.id === taskId);
      if (taskIndex !== -1) {
        return tasks.toSpliced(taskIndex, 1);
      }

      return tasks;
    });
  }

  updatePriority(taskId: string, priority: Priority): void {
    this.tasks.update((tasks) => {
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      const [foundTask] = tasks.splice(taskIndex, 1);
      if (foundTask) {
        foundTask.priority = priority;
        return [...tasks, foundTask];
      }
      return tasks;
    });
  }
}
