import { Signal } from '@angular/core';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { Author, Task } from './task';
import { TaskStore } from './task.store';

const mockedNanoid = vi.fn();

vi.mock('nanoid', () => ({
  nanoid: () => mockedNanoid(),
}));

describe('TaskStore', () => {
  const store = new TaskStore();
  const author: Author = {
    id: 'author_AAA',
    name: 'Random Author',
    email: 'random@example.com',
  };

  it('creates', () => {
    expect(store).toBeDefined();
  });

  describe('SelectByStatus', () => {
    it('Returns tasks filtered by provided status', () => {
      store.init([
        {
          id: 'task_1',
          title: 'Task A',
          status: 'todo',
          author,
          priority: 'low',
        },
        {
          id: 'task_2',
          title: 'Task B',
          status: 'in_progress',
          author,
          priority: 'low',
        },
        {
          id: 'task_3',
          title: 'Task C',
          status: 'done',
          author,
          priority: 'low',
        },
        {
          id: 'task_4',
          title: 'Task D',
          status: 'todo',
          author,
          priority: 'low',
        },
      ]);

      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_4' }),
      ]);
    });

    it('Returns tasks sorted by priority', () => {
      store.init([
        {
          id: 'task_1',
          title: 'Task A',
          status: 'todo',
          author,
          priority: 'low',
        },
        {
          id: 'task_2',
          title: 'Task D',
          status: 'todo',
          author,
          priority: 'critical',
        },
        {
          id: 'task_3',
          title: 'Task D',
          status: 'todo',
          author,
          priority: 'medium',
        },
        {
          id: 'task_4',
          title: 'Task D',
          status: 'todo',
          author,
          priority: 'high',
        },
      ]);

      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_2' }),
        expect.objectContaining({ id: 'task_4' }),
        expect.objectContaining({ id: 'task_3' }),
        expect.objectContaining({ id: 'task_1' }),
      ]);
    });
  });

  describe('AddTask', () => {
    beforeEach(() => {
      store.init([
        {
          id: 'task_1',
          title: 'Task A',
          status: 'todo',
          author,
          priority: 'low',
        },
        {
          id: 'task_2',
          title: 'Task B',
          status: 'todo',
          author,
          priority: 'low',
        },
      ]);
    });

    it('Sanity checks', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');
      expect(todos()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_2' }),
      ]);
    });

    it('Add a task into the store', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');

      mockedNanoid.mockReturnValue('task_3');

      store.addTask({
        title: 'Task C',
        status: 'todo',
        author,
        priority: 'low',
      });

      expect(todos()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_2' }),
        expect.objectContaining({ id: 'task_3' }),
      ]);
    });
  });

  describe('UpdateTask', () => {
    beforeEach(() => {
      store.init([
        {
          id: 'task_1',
          title: 'Task A',
          status: 'todo',
          author,
          priority: 'low',
        },
        {
          id: 'task_2',
          title: 'Task B',
          status: 'todo',
          author,
          priority: 'low',
        },
      ]);
    });

    it('Sanity checks', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');
      expect(todos()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_2' }),
      ]);
    });

    it('Update the task title', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');

      store.updateTask('task_2', { title: 'Nouveau titre' });

      expect(todos()).toEqual(
        expect.arrayContaining([
          {
            id: 'task_2',
            title: 'Nouveau titre',
            status: 'todo',
            author,
            priority: 'low',
          },
        ]),
      );
    });

    it('Update the task priority', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');

      store.updateTask('task_2', { priority: 'critical' });

      expect(todos()).toEqual(
        expect.arrayContaining([
          {
            id: 'task_2',
            title: 'Task B',
            status: 'todo',
            author,
            priority: 'critical',
          },
        ]),
      );
    });
  });

  describe('ChangeTaskStatus', () => {
    beforeEach(() => {
      store.init([
        {
          id: 'task_1',
          title: 'Task A',
          status: 'todo',
          author,
          priority: 'low',
        },
        {
          id: 'task_2',
          title: 'Task B',
          status: 'todo',
          author,
          priority: 'low',
        },
      ]);
    });

    it('Sanity checks', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');
      const done: Signal<Task[]> = store.selectByStatus('done');
      expect(todos()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_2' }),
      ]);

      expect(done()).toEqual([]);
    });

    it('Move the task out of previous selection', () => {
      const todos: Signal<Task[]> = store.selectByStatus('todo');

      store.changeTaskStatus('task_2', 'done');

      expect(todos()).toEqual([expect.objectContaining({ id: 'task_1' })]);
    });

    it('Move the task to the selection matching the new status', () => {
      const todos: Signal<Task[]> = store.selectByStatus('done');

      store.changeTaskStatus('task_2', 'done');

      expect(todos()).toEqual([expect.objectContaining({ id: 'task_2' })]);
    });

    it('Change the status of the task', () => {
      const todos: Signal<Task[]> = store.selectByStatus('done');

      store.changeTaskStatus('task_2', 'done');

      expect(todos()).toEqual([
        {
          id: 'task_2',
          title: 'Task B',
          status: 'done',
          author,
          priority: 'low',
        },
      ]);
    });
  });

  describe('Filter', () => {
    const authorB: Author = {
      id: 'author_BBB',
      name: 'Another Author',
      email: 'another@example.com',
    };

    beforeAll(() => {
      store.init([
        {
          id: 'task_1',
          title: 'Task A',
          status: 'todo',
          author: authorB,
          priority: 'critical',
        },
        {
          id: 'task_2',
          title: 'Task B',
          status: 'in_progress',
          author,
          priority: 'low',
        },
        {
          id: 'task_3',
          title: 'Task C',
          status: 'done',
          author: authorB,
          priority: 'medium',
        },
        {
          id: 'task_4',
          title: 'Task D',
          status: 'todo',
          author,
          priority: 'high',
        },
        {
          id: 'task_5',
          title: 'Task E',
          status: 'todo',
          author: authorB,
          priority: 'high',
        },
        {
          id: 'task_6',
          title: 'Task F',
          status: 'done',
          author,
          priority: 'low',
        },
        {
          id: 'task_7',
          title: 'Task G',
          status: 'in_progress',
          author: authorB,
          priority: 'high',
        },
        {
          id: 'task_8',
          title: 'Task H',
          status: 'done',
          author,
          priority: 'critical',
        },
        {
          id: 'task_9',
          title: 'Task I',
          status: 'todo',
          author: authorB,
          priority: 'low',
        },
        {
          id: 'task_10',
          title: 'Task J',
          status: 'in_progress',
          author,
          priority: 'medium',
        },
      ]);
    });

    beforeEach(() => {
      store.updateFilters({});
    })

    it('Returns task filtered by title', () => {
      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_4' }),
        expect.objectContaining({ id: 'task_5' }),
        expect.objectContaining({ id: 'task_9' }),
      ]);

      store.updateFilters({ title: 'Task A' });

      expect(store.selectByStatus('todo')()).toEqual([expect.objectContaining({ id: 'task_1' })]);
    });

    it('Returns task filtered by priorities', () => {
      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_4' }),
        expect.objectContaining({ id: 'task_5' }),
        expect.objectContaining({ id: 'task_9' }),
      ]);

      store.updateFilters({ priorities: ['low', 'critical'] });

      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_9' })
      ]);
    });

    it('Returns task filtered by authors', () => {
      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_4' }),
        expect.objectContaining({ id: 'task_5' }),
        expect.objectContaining({ id: 'task_9' }),
      ]);

      store.updateFilters({ authors: [authorB.id] });

      expect(store.selectByStatus('todo')()).toEqual([
        expect.objectContaining({ id: 'task_1' }),
        expect.objectContaining({ id: 'task_5' }),
        expect.objectContaining({ id: 'task_9' }),
      ]);
    });
  });
});
