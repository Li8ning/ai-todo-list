import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ProjectSelector } from './ProjectSelector';
import { DatePicker } from './DatePicker';
import type { TodoPriority, Project } from '../types/todo';

interface TodoInputProps {
  onAdd: (title: string, description?: string, priority?: TodoPriority, dueDate?: Date, projectId?: string) => void;
  projects: Project[];
  placeholder?: string;
  defaultProjectId?: string;
}

export function TodoInput({ onAdd, projects, placeholder = "What needs to be done?", defaultProjectId }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [projectId, setProjectId] = useState<string>(defaultProjectId || 'inbox');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined, priority, dueDate, projectId);
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setPriority('medium');
      setProjectId(defaultProjectId || 'inbox');
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

              <div className="space-y-3">
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
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date:
                    </label>
                    <DatePicker
                      selected={dueDate}
                      onSelect={setDueDate}
                      placeholder="Pick a date"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Project:
                  </label>
                  <ProjectSelector
                    projects={projects}
                    selectedProjectId={projectId}
                    onProjectChange={setProjectId}
                    className="flex-wrap"
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
                    setDueDate(undefined);
                    setPriority('medium');
                    setProjectId(defaultProjectId || 'inbox');
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