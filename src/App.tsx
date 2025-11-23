import { useEffect } from 'react';
import { Layout } from './components/layout';
import { Button, Card, CardHeader, CardTitle, CardContent } from './components/ui';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilters } from './components/TodoFilters';
import { useTodos } from './hooks/useTodos';

function App() {
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

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y' || (e.key === 'z' && e.shiftKey)) && canRedo) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <Layout>
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
          <TodoInput onAdd={addTodo} />
        </div>

        {/* Filters and Stats */}
        <TodoFilters filter={filter} onFilterChange={setFilter} stats={stats} />

        {/* Todo List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Todo List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {filter.status === 'all' ? 'All Todos' :
                     filter.status === 'pending' ? 'Pending Tasks' :
                     filter.status === 'in-progress' ? 'In Progress' :
                     filter.status === 'completed' ? 'Completed Tasks' :
                     'Filtered Todos'}
                  </CardTitle>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <TodoList
                  todos={todos}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                  onReorder={reorderTodos}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="font-semibold text-green-600">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                    <span className="font-semibold text-blue-600">{stats.inProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    <span className="font-semibold text-orange-600">{stats.pending}</span>
                  </div>
                  {stats.overdue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Overdue</span>
                      <span className="font-semibold text-red-600">{stats.overdue}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setFilter({ ...filter, status: 'completed' })}
                  >
                    View Completed
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setFilter({ ...filter, status: 'pending' })}
                  >
                    View Pending
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setFilter({ status: 'all', priority: 'all' })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
