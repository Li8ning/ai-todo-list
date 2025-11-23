import { useState, useEffect, useCallback } from 'react';
import type { Todo, TodoPriority, TodoFilter, TodoStats } from '../types/todo';
import { TodoStorage } from '../services/todoStorage';

interface TodoAction {
  type: 'add' | 'update' | 'delete' | 'reorder';
  payload: unknown;
  previousState?: Todo[];
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => TodoStorage.getTodos());
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

  const addTodo = useCallback((title: string, description?: string, priority: TodoPriority = 'medium', dueDate?: Date) => {
    const newTodo: Todo = {
      id: TodoStorage.generateId(),
      title,
      description,
      status: 'pending',
      priority,
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

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>>) => {
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

  // Filter and sort todos
  const filteredTodos = todos
    .filter(todo => {
      if (filter.status && filter.status !== 'all' && todo.status !== filter.status) return false;
      if (filter.priority && filter.priority !== 'all' && todo.priority !== filter.priority) return false;
      if (filter.search && !todo.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  // Calculate stats
  const stats: TodoStats = {
    total: todos.length,
    completed: todos.filter(t => t.status === 'completed').length,
    pending: todos.filter(t => t.status === 'pending').length,
    inProgress: todos.filter(t => t.status === 'in-progress').length,
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