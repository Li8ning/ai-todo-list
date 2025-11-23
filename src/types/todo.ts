export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  order: number;
}

export interface TodoFilter {
  status?: TodoStatus | 'all';
  priority?: TodoPriority | 'all';
  search?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
}