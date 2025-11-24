import { useState } from 'react';
import { isBefore, startOfDay } from 'date-fns';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { ProjectBadge } from './ProjectSelector';
import { PriorityBadge } from './PriorityBadge';
import type { Todo, TodoStatus, Project } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'projectId'>>) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragListeners?: unknown;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  showBulkSelect?: boolean;
}

export function TodoItem({ todo, projects, onUpdate, onDelete, isDragging = false, dragListeners, isSelected = false, onToggleSelect, showBulkSelect = false }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStatusChange = (newStatus: TodoStatus) => {
    onUpdate(todo.id, { status: newStatus });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };


  const isOverdue = todo.dueDate && isBefore(startOfDay(todo.dueDate), startOfDay(new Date())) && todo.status !== 'completed';
  const project = projects.find(p => p.id === todo.projectId);

  return (
    <>
      <div
        className={`group bg-white dark:bg-gray-900 rounded-lg border transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 shadow-lg rotate-2'
            : todo.status === 'completed'
            ? 'border-gray-200 dark:border-gray-700 opacity-75'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
        } ${isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Selection Checkbox */}
            {showBulkSelect && onToggleSelect && (
              <div className="flex-shrink-0 mt-1" data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(todo.id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            )}
            {/* Drag Handle */}
            <div className="flex-shrink-0 mt-1 cursor-grab" {...(dragListeners || {})}>
              ⋮⋮
            </div>
            {/* Status Checkbox */}
            <div className="flex-shrink-0 mt-1" data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={todo.status === 'completed'}
                onChange={(e) => handleStatusChange(e.target.checked ? 'completed' : 'pending')}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2" data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-2 py-1 text-lg font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} disabled={!editTitle.trim()}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3
                    className={`text-lg font-medium text-gray-900 dark:text-gray-100 ${
                      todo.status === 'completed' ? 'line-through text-gray-500' : ''
                    } ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${
                      todo.status === 'completed' ? 'line-through' : ''
                    }`}>
                      {todo.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={getStatusColor(todo.status)}>
                      {todo.status.replace('-', ' ')}
                    </Badge>
                    <PriorityBadge priority={todo.priority} />
                    {project && <ProjectBadge project={project} />}
                    {todo.dueDate && (
                      <Badge variant={isOverdue ? 'error' : 'secondary'}>
                        Due {todo.dueDate.toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            {!isEditing && (
              <div className="flex-shrink-0 flex gap-1" data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                  title="Edit task"
                >
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDeleteModal(true)}
                  className="h-8 w-8 p-0 opacity-60 hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  title="Delete task"
                >
                  🗑️
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Task</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete "{todo.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDelete(todo.id);
                setShowDeleteModal(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}