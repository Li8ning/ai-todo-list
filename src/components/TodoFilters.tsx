import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal';
import type { TodoFilter, TodoStatus, TodoPriority, SavedFilter } from '../types/todo';

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  savedFilters: SavedFilter[];
  onSaveFilter: (name: string) => void;
  onLoadFilter: (filter: TodoFilter) => void;
  onDeleteFilter: (id: string) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
  };
}

export function TodoFilters({ filter, onFilterChange, savedFilters, onSaveFilter, onLoadFilter, onDeleteFilter, stats }: TodoFiltersProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const statusFilters: { value: TodoStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityFilters: { value: TodoPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const dueDateFilters: { value: string; label: string }[] = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const handleStatusFilter = (status: TodoStatus | 'all') => {
    onFilterChange({ ...filter, status });
  };

  const handlePriorityFilter = (priority: TodoPriority | 'all') => {
    onFilterChange({ ...filter, priority });
  };

  const handleSearch = (search: string) => {
    onFilterChange({ ...filter, search: search || undefined });
  };

  const handleDueDateFilter = (dueDateRange: string) => {
    onFilterChange({
      ...filter,
      dueDateRange: dueDateRange as 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'overdue' | 'custom' | 'all'
    });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'all', priority: 'all', projectId: 'all', dueDateRange: 'all' });
  };

  const hasActiveFilters = filter.status !== 'all' || filter.priority !== 'all' || filter.projectId !== 'all' || filter.dueDateRange !== 'all' || !!filter.search;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search todos..."
            value={filter.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filters */}
          <div className="flex gap-1">
            {statusFilters.map(({ value, label }) => (
              <Button
                key={value}
                variant={filter.status === value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleStatusFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Priority Filter */}
          <select
            value={filter.priority || 'all'}
            onChange={(e) => handlePriorityFilter(e.target.value as TodoPriority | 'all')}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorityFilters.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Due Date Filter */}
          <select
            value={filter.dueDateRange || 'all'}
            onChange={(e) => handleDueDateFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {dueDateFilters.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}

          {/* Save Filter */}
          {hasActiveFilters && (
            <Button variant="secondary" size="sm" onClick={() => setShowSaveModal(true)}>
              Save Filter
            </Button>
          )}
        </div>
      </div>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved Filters:</span>
            {savedFilters.map((savedFilter) => (
              <div key={savedFilter.id} className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onLoadFilter(savedFilter.filter)}
                  className="text-xs"
                >
                  {savedFilter.name}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteFilter(savedFilter.id)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  title="Delete filter"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Modal */}
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)}>
        <ModalHeader>
          <ModalTitle>Save Filter</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter Name
              </label>
              <Input
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Enter a name for this filter"
                autoFocus
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowSaveModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (filterName.trim()) {
                onSaveFilter(filterName.trim());
                setFilterName('');
                setShowSaveModal(false);
              }
            }}
            disabled={!filterName.trim()}
          >
            Save Filter
          </Button>
        </ModalFooter>
      </Modal>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
}