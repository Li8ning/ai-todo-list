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
  onToggleSelect: (id: string) => void;
}

function SortableTodoItem({ todo, projects, onUpdate, onDelete, isSelected, onToggleSelect }: SortableTodoItemProps) {
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
      />
    </div>
  );
}

interface TodoListProps {
  todos: Todo[];
  projects: Project[];
  onUpdate: (id: string, updates: Partial<Pick<Todo, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'projectId'>>) => void;
  onDelete: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onBulkUpdate?: (updates: Partial<Todo>) => void;
  onBulkDelete?: () => void;
}

export function TodoList({ todos, projects, onUpdate, onDelete, onReorder, selectedIds = [], onSelectionChange, onBulkUpdate, onBulkDelete }: TodoListProps) {
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
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      onReorder(oldIndex, newIndex);
    }
  }

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
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-2 ml-auto">
            {onBulkUpdate && (
              <>
                <button
                  onClick={() => onBulkUpdate({ status: 'completed' })}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => onBulkUpdate({ status: 'pending' })}
                  className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                >
                  Mark Pending
                </button>
                <button
                  onClick={() => onBulkUpdate({ priority: 'high' })}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Set High Priority
                </button>
              </>
            )}
            {onBulkDelete && (
              <button
                onClick={onBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected
              </button>
            )}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                projects={projects}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isSelected={selectedIds.includes(todo.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}