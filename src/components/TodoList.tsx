import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem } from './TodoItem';
import type { Todo, Project } from '../types/todo';

interface SortableTodoItemProps {
  todo: Todo;
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'projectId'>>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onToggleSelect?: (id: string) => void;
  showBulkSelect?: boolean;
}

const SortableTodoItem = React.memo(function SortableTodoItem({ todo, projects, onUpdate, onDelete, isSelected, onToggleSelect, showBulkSelect }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TodoItem
        key={todo.id}
        todo={todo}
        projects={projects}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isDragging={isDragging}
        dragListeners={listeners}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        showBulkSelect={showBulkSelect}
      />
    </div>
  );
});

interface TodoListProps {
  todos: Todo[];
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'projectId' | 'order'>>) => void;
  onDelete: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onBulkUpdate?: (updates: Partial<Todo>) => void;
  onBulkDelete?: () => void;
  bulkSelectMode?: boolean;
}

export const TodoList = React.memo(function TodoList({ todos, projects, onUpdate, onDelete, onReorder, selectedIds = [], onSelectionChange, onBulkUpdate, onBulkDelete, bulkSelectMode = false }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleSelect = (id: string) => {
    if (!onSelectionChange) return;
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelected);
  };


  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  }

  const isLargeList = todos.length > 100;

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No todos yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Bulk Actions Toolbar */}
      {bulkSelectMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 p-3 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 sm:mb-0">
            {selectedIds.length} selected
          </span>
          <div className="flex flex-wrap gap-2 sm:ml-auto w-full sm:w-auto">
            {onSelectionChange && (
              <>
                <button
                  onClick={() => onSelectionChange(todos.map(todo => todo.id))}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  Select All
                </button>
                <button
                  onClick={() => onSelectionChange([])}
                  className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  Deselect All
                </button>
              </>
            )}
            {selectedIds.length > 0 && onBulkUpdate && (
              <>
                <button
                  onClick={() => onBulkUpdate({ status: 'completed' })}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                  ✓ Complete
                </button>
                <button
                  onClick={() => onBulkUpdate({ status: 'pending' })}
                  className="px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  ○ Pending
                </button>
                <button
                  onClick={() => onBulkUpdate({ priority: 'high' })}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  ⚠ High
                </button>
              </>
            )}
            {selectedIds.length > 0 && onBulkDelete && (
              <button
                onClick={onBulkDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      )}

      {isLargeList ? (
        // For large lists, disable drag and drop for performance
        <div className="space-y-3 sm:space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              projects={projects}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isSelected={selectedIds.includes(todo.id)}
              onToggleSelect={bulkSelectMode ? handleToggleSelect : undefined}
              showBulkSelect={bulkSelectMode}
            />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 sm:space-y-3">
              {todos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  projects={projects}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  isSelected={selectedIds.includes(todo.id)}
                  onToggleSelect={bulkSelectMode ? handleToggleSelect : undefined}
                  showBulkSelect={bulkSelectMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
});