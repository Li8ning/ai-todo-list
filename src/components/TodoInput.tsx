import { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { DatePicker } from './DatePicker';
import type { TodoPriority, Project } from '../types/todo';

interface TodoInputProps {
  onAdd: (title: string, description?: string, priority?: TodoPriority, dueDate?: Date, projectId?: string) => void;
  projects: Project[];
  placeholder?: string;
  defaultProjectId?: string;
  hideProjectSelector?: boolean;
}

export function TodoInput({ onAdd, projects, placeholder = "What needs to be done?", defaultProjectId, hideProjectSelector = false }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [projectId, setProjectId] = useState<string>(defaultProjectId || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const projectInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const finalProjectId = hideProjectSelector ? defaultProjectId : projectId;
      onAdd(title.trim(), description.trim() || undefined, priority, dueDate, finalProjectId);
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setPriority('medium');
      setProjectId(defaultProjectId || '');
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

                {!hideProjectSelector && (
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                      Project:
                    </label>
                    <div className="relative">
                      <input
                        ref={projectInputRef}
                        type="text"
                        value={projectId ? projects.find(p => p.id === projectId)?.name || '' : projectSearch}
                        onChange={(e) => {
                          setProjectSearch(e.target.value);
                          setProjectId(''); // Clear selection when typing
                          setShowProjectDropdown(true);
                        }}
                        onFocus={() => setShowProjectDropdown(true)}
                        onBlur={() => {
                          // Delay hiding to allow click on options
                          setTimeout(() => setShowProjectDropdown(false), 200);
                        }}
                        placeholder="Search and select project..."
                        className={`w-full px-3 py-2 text-sm border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !hideProjectSelector && !projectId && title.trim()
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {projectId && (
                        <button
                          type="button"
                          onClick={() => {
                            setProjectId('');
                            setProjectSearch('');
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {showProjectDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto">
                        {projects
                          .filter(project =>
                            project.name.toLowerCase().includes(projectSearch.toLowerCase())
                          )
                          .map(project => (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => {
                                setProjectId(project.id);
                                setProjectSearch(project.name);
                                setShowProjectDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: project.color }}
                                />
                                {project.name}
                              </div>
                            </button>
                          ))}
                        {projects.filter(project =>
                          project.name.toLowerCase().includes(projectSearch.toLowerCase())
                        ).length === 0 && projectSearch && (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No projects found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!title.trim() || (!hideProjectSelector && !projectId)}>
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
                    setProjectId(defaultProjectId || '');
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