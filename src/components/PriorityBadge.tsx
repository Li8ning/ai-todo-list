import type { TodoPriority } from '../types/todo';

interface PriorityBadgeProps {
  priority: TodoPriority;
  className?: string;
}

const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
    icon: '🔥'
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    icon: '📝'
  },
  low: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700',
    icon: '🐌'
  }
};

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.color} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export function PriorityDot({ priority, className = '' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={`inline-flex items-center justify-center w-3 h-3 text-xs rounded-full ${config.color} ${className}`}
      title={config.label}
    >
      {config.icon}
    </span>
  );
}