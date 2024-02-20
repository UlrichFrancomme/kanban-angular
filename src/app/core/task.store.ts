import { computed, Injectable, signal, Signal } from '@angular/core';
import { nanoid } from 'nanoid';

import { Filters, filtersAreEmpty } from './filters';
import { Status, Task } from './task';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private tasks = signal<Task[]>([], { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) });
  private filters = signal<Filters>({});

  private filteredTasks = computed(() => {
    const filters = this.filters();
    if (filtersAreEmpty(filters)) {
      return this.tasks();
    }
    return this.tasks().filter((task) => {
      let isValid = false;
      if (filters.title?.length) {
        isValid = task.title.includes(filters.title);
      }

      if (filters.priorities?.length) {
        console.log(`${filters.priorities} includes ${task.priority}`, task.id)
        isValid = filters.priorities.includes(task.priority);
      }

      if (filters.authors?.length) {
        isValid = filters.authors.includes(task.author.id);
      }

      return isValid;
    });
  });

  init(tasks: Task[]): void {
    this.tasks.set(tasks);
  }

  selectByStatus(status: Status): Signal<Task[]> {
    return computed(() =>
      this.filteredTasks()
        .filter((item) => item.status === status)
        .toSorted(this.compareFn.bind(this)),
    );
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

  updateFilters(filters: Filters): void {
    this.filters.set(filters);
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

  updateTask(taskId: string, update: Partial<Pick<Task, 'title' | 'priority'>>): void {
    this.tasks.update((tasks) => {
      const taskToUpdate = tasks.find((item) => item.id === taskId);
      if (taskToUpdate) {
        taskToUpdate.title = update.title ?? taskToUpdate.title;
        taskToUpdate.priority = update.priority ?? taskToUpdate.priority;
      }

      return [...tasks];
    });
  }

  changeTaskStatus(taskId: string, status: Status): void {
    this.tasks.update((tasks) => {
      const foundTask = tasks.find((task) => task.id === taskId);
      if (foundTask) {
        foundTask.status = status;
      }
      return [...tasks];
    });
  }
}
