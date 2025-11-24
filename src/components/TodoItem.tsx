import React, { useState } from 'react';
import { isBefore, startOfDay } from 'date-fns';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { ProjectBadge } from './ProjectSelector';
import { PriorityBadge } from './PriorityBadge';
import { DatePicker } from './DatePicker';
import type { Todo, TodoStatus, TodoPriority, Project } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'projectId' | 'order'>>) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragListeners?: unknown;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  showBulkSelect?: boolean;
}

export const TodoItem = React.memo(function TodoItem({ todo, projects, onUpdate, onDelete, isDragging = false, dragListeners, isSelected = false, onToggleSelect, showBulkSelect = false }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(todo.dueDate);
  const [editPriority, setEditPriority] = useState<TodoPriority>(todo.priority);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleStatusChange = (newStatus: TodoStatus) => {
    onUpdate(todo.id, { status: newStatus });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        dueDate: editDueDate,
        priority: editPriority,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate);
    setEditPriority(todo.priority);
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
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle & Checkboxes */}
            <div className="flex-shrink-0 flex items-center gap-2 pt-1">
              {showBulkSelect && onToggleSelect && (
                <div data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(todo.id)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              )}
              <div className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-none" {...(dragListeners || {})}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                </svg>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2" data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                  {/* ... editing UI ... */}
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as TodoPriority)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Date
                      </label>
                      <DatePicker
                        selected={editDueDate}
                        onSelect={setEditDueDate}
                        placeholder="No due date"
                        className="w-full"
                      />
                    </div>
                  </div>
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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-1" data-no-dnd="true" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={todo.status === 'completed'}
                          onChange={(e) => handleStatusChange(e.target.checked ? 'completed' : 'pending')}
                          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 leading-snug ${
                            todo.status === 'completed' ? 'line-through text-gray-500' : ''
                          } ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${
                            todo.status === 'completed' ? 'line-through' : ''
                          }`}>
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata Pills */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className={`${getStatusColor(todo.status)} text-xs px-2 py-0.5`}>
                        {todo.status.replace('-', ' ')}
                      </Badge>
                      <PriorityBadge priority={todo.priority} />
                      {project && <ProjectBadge project={project} />}
                      {todo.dueDate && (
                        <Badge variant={isOverdue ? 'error' : 'secondary'} className="text-xs px-2 py-0.5">
                          📅 {todo.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center gap-1"
                    data-no-dnd="true"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                      title="Edit task"
                    >
                      <span className="sr-only">Edit</span>
                      ✏️
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowDeleteModal(true)}
                      className="h-8 w-8 p-0 opacity-60 hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      title="Delete task"
                    >
                      <span className="sr-only">Delete</span>
                      🗑️
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
});