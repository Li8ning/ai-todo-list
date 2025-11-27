import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal';
import { DatePicker } from './DatePicker';
import { PriorityBadge } from './PriorityBadge';
import type { AIGeneratedTodo } from '../services/aiService';
import type { TodoPriority } from '../types/todo';

interface EditableTodo extends AIGeneratedTodo {
  selected: boolean;
}

interface AITodoReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedTodos: AIGeneratedTodo[];
  onAcceptTodos: (todos: AIGeneratedTodo[]) => void;
}

export function AITodoReviewModal({
  isOpen,
  onClose,
  generatedTodos,
  onAcceptTodos
}: AITodoReviewModalProps) {
  const [editedTodos, setEditedTodos] = useState<AIGeneratedTodo[]>([]);
  const [selections, setSelections] = useState<boolean[]>([]);

  // Sync state with props when generatedTodos changes
  useEffect(() => {
    setEditedTodos([...generatedTodos]);
    setSelections(generatedTodos.map(() => true));
  }, [generatedTodos]);


  // Derive todos with selections
  const todos: EditableTodo[] = editedTodos.map((todo, index) => ({
    ...todo,
    selected: selections[index] ?? true
  }));

  const handleTodoChange = (index: number, field: keyof AIGeneratedTodo, value: string | Date | undefined) => {
    setEditedTodos(prev => prev.map((todo, i) =>
      i === index ? { ...todo, [field]: value } : todo
    ));
  };

  const handleSelectionChange = (index: number, selected: boolean) => {
    setSelections(prev => prev.map((sel, i) =>
      i === index ? selected : sel
    ));
  };

  const handleSelectAll = () => {
    const allSelected = selections.every(sel => sel);
    setSelections(prev => prev.map(() => !allSelected));
  };

  const handleAccept = () => {
    const selectedTodos = editedTodos.filter((_todo, index) => selections[index]);
    onAcceptTodos(selectedTodos);
    onClose();
  };

  const handleClose = () => {
    setEditedTodos([...generatedTodos]);
    setSelections(generatedTodos.map(() => true));
    onClose();
  };

  const selectedCount = selections.filter(sel => sel).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-4xl">
      <ModalHeader>
        <ModalTitle>Review AI-Generated Todos</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <div className="space-y-4">
          {/* Header with select all */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCount} of {todos.length} todos selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              {selections.every(sel => sel) ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {todos.map((todo, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  todo.selected
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={todo.selected}
                    onChange={(e) => handleSelectionChange(index, e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />

                  {/* Todo Content */}
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <input
                      type="text"
                      value={todo.title}
                      onChange={(e) => handleTodoChange(index, 'title', e.target.value)}
                      className="w-full px-2 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Todo title"
                    />

                    {/* Description */}
                    <textarea
                      value={todo.description || ''}
                      onChange={(e) => handleTodoChange(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                      rows={2}
                      placeholder="Description (optional)"
                    />

                    {/* Priority and Due Date */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Priority:</label>
                        <select
                          value={todo.priority}
                          onChange={(e) => handleTodoChange(index, 'priority', e.target.value as TodoPriority)}
                          className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                        <PriorityBadge priority={todo.priority} />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Due Date:</label>
                        <DatePicker
                          selected={todo.dueDate}
                          onSelect={(date) => handleTodoChange(index, 'dueDate', date)}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editedTodos.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No todos were generated. Try adjusting your prompt or generation settings.
            </div>
          )}
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAccept}
          disabled={selectedCount === 0}
        >
          Add {selectedCount} Todo{selectedCount !== 1 ? 's' : ''}
        </Button>
      </ModalFooter>
    </Modal>
  );
}