export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export type TodoPriority = 'critical' | 'urgent' | 'high' | 'normal' | 'medium' | 'low';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  order: number;
}

export interface TodoFilter {
  status?: TodoStatus | 'all';
  priority?: TodoPriority | 'all';
  projectId?: string | 'all';
  search?: string;
  dueDateRange?: 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'overdue' | 'custom' | 'all';
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
}

export interface SavedFilter {
  id: string;
  name: string;
  filter: TodoFilter;
  createdAt: Date;
  updatedAt: Date;
}