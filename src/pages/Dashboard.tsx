import { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { TodoFilters } from '../components/TodoFilters';
import { useTodos } from '../hooks/useTodos';
import { useProjects } from '../hooks/useProjects';
import { useSavedFilters } from '../hooks/useSavedFilters';
import type { TodoFilter, Todo } from '../types/todo';

export const Dashboard = () => {

  const {
    todos,
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
  } = useTodos();

  const { projects } = useProjects();
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();

  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);

  const handleSaveFilter = (name: string) => {
    saveFilter(name, filter);
  };

  const handleLoadFilter = (loadedFilter: TodoFilter) => {
    setFilter(loadedFilter);
  };

  const handleDeleteFilter = (id: string) => {
    deleteFilter(id);
  };

  const handleBulkUpdate = (updates: Partial<Todo>) => {
    selectedTodoIds.forEach(id => {
      updateTodo(id, updates);
    });
    setSelectedTodoIds([]);
    setBulkSelectMode(false);
  };

  const handleBulkDelete = () => {
    selectedTodoIds.forEach(id => {
      deleteTodo(id);
    });
    setSelectedTodoIds([]);
    setBulkSelectMode(false);
  };
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Todo Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your tasks efficiently with our modern, intuitive interface.
        </p>
      </div>

      {/* Undo/Redo Controls */}
      <div className="flex gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          leftIcon="↶"
        >
          Undo
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          leftIcon="↷"
        >
          Redo
        </Button>
        <span className="text-sm text-gray-500 dark:text-gray-400 self-center ml-4">
          Ctrl+Z / Ctrl+Y
        </span>
      </div>

      {/* Add Todo */}
      <div className="mb-6">
        <TodoInput onAdd={addTodo} projects={projects} />
      </div>

      {/* Filters and Stats */}
      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
        onLoadFilter={handleLoadFilter}
        onDeleteFilter={handleDeleteFilter}
        stats={stats}
      />

      {/* Todo List - Full Width */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {filter.status === 'all' ? 'All Todos' :
               filter.status === 'pending' ? 'Pending Tasks' :
               filter.status === 'completed' ? 'Completed Tasks' :
               'Filtered Todos'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {!bulkSelectMode && todos.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBulkSelectMode(true)}
                >
                  Bulk Select
                </Button>
              )}
              {bulkSelectMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBulkSelectMode(false);
                    setSelectedTodoIds([]);
                  }}
                >
                  Cancel
                </Button>
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TodoList
            todos={todos}
            projects={projects}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onReorder={reorderTodos}
            selectedIds={selectedTodoIds}
            onSelectionChange={setSelectedTodoIds}
            onBulkUpdate={handleBulkUpdate}
            onBulkDelete={handleBulkDelete}
            bulkSelectMode={bulkSelectMode}
          />
        </CardContent>
      </Card>
    </div>
  );
};