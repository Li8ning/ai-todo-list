import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { TodoFilters } from '../components/TodoFilters';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import { useTodos } from '../hooks/useTodos';
import { useProjects } from '../hooks/useProjects';
import { useSavedFilters } from '../hooks/useSavedFilters';
import type { TodoFilter, Todo } from '../types/todo';

export const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    todos: allTodos,
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

  const { projects, updateProject, deleteProject, getProjectById } = useProjects();
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();

  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');

  const project = projectId ? getProjectById(projectId) : null;

  // Filter todos for this project
  const todos = useMemo(() => {
    if (!projectId) return [];
    return allTodos.filter(todo => todo.projectId === projectId);
  }, [allTodos, projectId]);

  // Calculate project-specific stats
  const projectStats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter(todo => todo.status === 'completed').length,
      pending: todos.filter(todo => todo.status === 'pending').length,
      inProgress: 0, // Not used in current implementation
      overdue: todos.filter(todo =>
        todo.dueDate && todo.dueDate < new Date() && todo.status === 'pending'
      ).length,
    };
  }, [todos]);

  const handleSaveProjectName = () => {
    if (project && tempName.trim()) {
      updateProject(project.id, { name: tempName.trim() });
      setEditingName(false);
    }
  };

  const handleSaveProjectDescription = () => {
    if (project) {
      updateProject(project.id, { description: tempDescription });
      setEditingDescription(false);
    }
  };

  const handleDeleteProjectClick = () => {
    setShowDeleteProjectModal(true);
  };

  const handleConfirmDeleteProject = () => {
    if (projectId) {
      deleteProject(projectId);
      setShowDeleteProjectModal(false);
      navigate('/');
    }
  };

  const handleSaveFilter = (name: string) => {
    saveFilter(name, { ...filter, projectId });
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

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back to Dashboard */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          leftIcon="←"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Project Header */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-3xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 px-1 py-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveProjectName();
                        if (e.key === 'Escape') setEditingName(false);
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveProjectName}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>Cancel</Button>
                  </div>
                ) : (
                  <h1
                    className="text-3xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => {
                      setTempName(project.name);
                      setEditingName(true);
                    }}
                  >
                    {project.name}
                  </h1>
                )}
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteProjectClick}
              >
                Delete Project
              </Button>
            </div>
            <div className="mt-4">
              {editingDescription ? (
                <div className="flex items-center gap-2">
                  <textarea
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    className="flex-1 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                    rows={3}
                    placeholder="Add a description..."
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setEditingDescription(false);
                    }}
                    autoFocus
                  />
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={handleSaveProjectDescription}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingDescription(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded"
                  onClick={() => {
                    setTempDescription(project.description || '');
                    setEditingDescription(true);
                  }}
                >
                  {project.description || 'Click to add description...'}
                </p>
              )}
            </div>
          </CardHeader>
        </Card>
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
        <TodoInput onAdd={addTodo} projects={projects} defaultProjectId={projectId} hideProjectSelector={true} />
      </div>

      {/* Filters and Stats */}
      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        savedFilters={savedFilters}
        onSaveFilter={handleSaveFilter}
        onLoadFilter={handleLoadFilter}
        onDeleteFilter={handleDeleteFilter}
        stats={projectStats}
      />

      {/* Todo List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Project Todos
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

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Delete Project</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete the project "{project.name}"?
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              This will permanently delete all todos associated with this project. This action cannot be undone.
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowDeleteProjectModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDeleteProject}
          >
            Delete Project
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};