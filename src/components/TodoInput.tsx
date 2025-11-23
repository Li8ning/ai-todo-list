import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { TodoPriority } from '../types/todo';

interface TodoInputProps {
  onAdd: (title: string, description?: string, priority?: TodoPriority, dueDate?: Date) => void;
  placeholder?: string;
}

export function TodoInput({ onAdd, placeholder = "What needs to be done?" }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      onAdd(title.trim(), description.trim() || undefined, priority, parsedDueDate);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className="text-lg font-medium"
            onKeyDown={handleKeyDown}
          />

          {isExpanded && (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
              />

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TodoPriority)}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date:
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!title.trim()}>
                  Add Task
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsExpanded(false);
                    setTitle('');
                    setDescription('');
                    setDueDate('');
                    setPriority('medium');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}