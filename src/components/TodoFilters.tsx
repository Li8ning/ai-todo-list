import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { TodoFilter, TodoStatus, TodoPriority } from '../types/todo';

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
  };
}

export function TodoFilters({ filter, onFilterChange, stats }: TodoFiltersProps) {
  const statusFilters: { value: TodoStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityFilters: { value: TodoPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
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

  const clearFilters = () => {
    onFilterChange({ status: 'all', priority: 'all' });
  };

  const hasActiveFilters = filter.status !== 'all' || filter.priority !== 'all' || !!filter.search;

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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

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