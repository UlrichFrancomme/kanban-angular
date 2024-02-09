export const Priorities = ['low', 'medium', 'high', 'critical'] as const;
export type Priority = (typeof Priorities)[number];

export const Statuses = ['todo', 'in_progress', 'done'] as const;
export type Status = (typeof Statuses)[number];

export type Author = {
  id: string;
  name: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  author: Author;
  status: Status;
  priority: Priority;
};
