import type { Todo, TodoPriority } from '../types/todo';

const STORAGE_KEY = 'ai-todo-list-todos';

export class TodoStorage {
  static getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored) as (Omit<Todo, 'createdAt' | 'updatedAt' | 'dueDate'> & {
        createdAt: string;
        updatedAt: string;
        dueDate?: string;
        projectId?: string;
      })[];
      // Convert date strings back to Date objects
      return parsed.map((todo): Todo => {
        // Migrate old priority values to new ones
        let priority: TodoPriority = todo.priority as TodoPriority;
        const oldPriority = todo.priority as string;
        if (oldPriority === 'critical' || oldPriority === 'urgent') {
          priority = 'high';
        } else if (oldPriority === 'normal') {
          priority = 'medium';
        }
        // 'high', 'medium', 'low' remain the same

        return {
          ...todo,
          priority,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        };
      });
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return [];
    }
  }

  static saveTodos(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getNextOrder(todos: Todo[]): number {
    if (todos.length === 0) return 0;
    return Math.max(...todos.map(todo => todo.order)) + 1;
  }
}