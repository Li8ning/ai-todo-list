import { useState, useEffect, useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Todo, TodoPriority, TodoFilter, TodoStats, TodoStatus } from '../types/todo';
import { TodoStorage } from '../services/todoStorage';

interface TodoAction {
  type: 'add' | 'update' | 'delete' | 'reorder';
  payload: unknown;
  previousState?: Todo[];
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = TodoStorage.getTodos();
    // Migrate any existing 'in-progress' todos to 'pending'
    const migratedTodos = storedTodos.map(todo => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((todo as any).status === 'in-progress') {
        return { ...todo, status: 'pending' as TodoStatus };
      }
      return todo;
    });
    // Save migrated todos back to storage if any were migrated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (storedTodos.some(todo => (todo as any).status === 'in-progress')) {
      TodoStorage.saveTodos(migratedTodos);
    }
    return migratedTodos;
  });
  const [history, setHistory] = useState<TodoAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all', priority: 'all' });

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    TodoStorage.saveTodos(todos);
  }, [todos]);

  const addAction = useCallback((action: TodoAction) => {
    // Remove any actions after current index (for new actions after undo)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addTodo = useCallback((title: string, description?: string, priority: TodoPriority = 'medium', dueDate?: Date, projectId?: string) => {
    const newTodo: Todo = {
      id: TodoStorage.generateId(),
      title,
      description,
      status: 'pending',
      priority,
      projectId: projectId || 'inbox',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate,
      order: TodoStorage.getNextOrder(todos),
    };

    const previousState = [...todos];
    setTodos(prev => [...prev, newTodo]);

    addAction({
      type: 'add',
      payload: newTodo,
      previousState,
    });
  }, [todos, addAction]);

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'projectId'>>) => {
    const previousState = [...todos];
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date() }
        : todo
    ));

    addAction({
      type: 'update',
      payload: { id, updates },
      previousState,
    });
  }, [todos, addAction]);

  const deleteTodo = useCallback((id: string) => {
    const previousState = [...todos];
    const todoToDelete = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(todo => todo.id !== id));

    addAction({
      type: 'delete',
      payload: todoToDelete,
      previousState,
    });
  }, [todos, addAction]);

  const reorderTodos = useCallback((startIndex: number, endIndex: number) => {
    const previousState = [...todos];
    const result = Array.from(todos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    // Update order property
    const reordered = result.map((todo, index) => ({ ...todo, order: index }));

    setTodos(reordered);

    addAction({
      type: 'reorder',
      payload: { startIndex, endIndex },
      previousState,
    });
  }, [todos, addAction]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      setTodos(action.previousState || []);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const action = history[nextIndex];
      if (action && action.previousState) {
        setTodos(action.previousState);
        setHistoryIndex(nextIndex);
      }
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  // Helper function to check if date is in range
  const isDateInRange = (date: Date, range: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - today.getDay()));

    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 1);

    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(endOfNextWeek.getDate() + 6);

    switch (range) {
      case 'today':
        return date >= today && date < tomorrow;
      case 'tomorrow': {
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        return date >= tomorrow && date < dayAfterTomorrow;
      }
      case 'this-week':
        return date >= today && date <= endOfWeek;
      case 'next-week':
        return date >= startOfNextWeek && date <= endOfNextWeek;
      default:
        return true;
    }
  };

  // Create fuzzy search instance
  const fuse = useMemo(() => {
    return new Fuse(todos, {
      keys: ['title', 'description'],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
    });
  }, [todos]);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter first
    if (filter.search && filter.search.trim()) {
      const searchResults = fuse.search(filter.search.trim());
      const searchIds = new Set(searchResults.map(result => result.item.id));
      filtered = filtered.filter(todo => searchIds.has(todo.id));
    }

    // Apply other filters
    filtered = filtered.filter(todo => {
      if (filter.status && filter.status !== 'all' && todo.status !== filter.status) return false;
      if (filter.priority && filter.priority !== 'all' && todo.priority !== filter.priority) return false;
      if (filter.projectId && filter.projectId !== 'all' && todo.projectId !== filter.projectId) return false;
      if (filter.dueDateRange && filter.dueDateRange !== 'all') {
        if (filter.dueDateRange === 'overdue') {
          if (!todo.dueDate || todo.dueDate >= new Date() || todo.status === 'completed') return false;
        } else if (todo.dueDate) {
          if (filter.dueDateRange === 'custom') {
            // For custom range, we'll handle this differently later
            return true;
          }
          return isDateInRange(todo.dueDate, filter.dueDateRange);
        } else {
          // If no due date but filtering by date range, exclude
          return false;
        }
      }
      return true;
    });

    // Sort by order
    return filtered.sort((a, b) => a.order - b.order);
  }, [todos, filter, fuse]);

  // Calculate stats
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(t => t.status === 'completed').length,
    pending: todos.filter(t => t.status === 'pending').length,
    inProgress: 0, // Removed, keeping for compatibility
    overdue: todos.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== 'completed').length,
  };

  return {
    todos: filteredTodos,
    allTodos: todos,
    stats,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}