import React from 'react';

export const TodoItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        {/* Drag Handle Skeleton */}
        <div className="flex-shrink-0 mt-1 w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        {/* Status Checkbox Skeleton */}
        <div className="flex-shrink-0 mt-1 w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>

        {/* Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Title Skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          {/* Description Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          {/* Badges Skeleton */}
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex-shrink-0 flex gap-1">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};