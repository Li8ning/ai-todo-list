import React from 'react';
import { useActivities } from '../hooks/useActivities';
import { useProjects } from '../hooks/useProjects';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed: React.FC = () => {
  const { activities } = useActivities();
  const { getProjectById } = useProjects();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'todo_created': return '➕';
      case 'todo_completed': return '✅';
      case 'todo_incomplete': return '⏸️';
      case 'todo_edited': return '✏️';
      case 'todo_deleted': return '🗑️';
      case 'project_created': return '📁';
      case 'project_edited': return '📝';
      case 'project_deleted': return '🗂️';
      case 'ai_generation': return '🤖';
      case 'bulk_operation': return '📋';
      case 'login': return '🔑';
      case 'logout': return '🚪';
      default: return '📝';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.slice(0, 10).map((activity) => {
          const projectId = activity.metadata?.projectId as string;
          const projectName = activity.metadata?.projectName as string;
          const project = projectId ? getProjectById(projectId) : null;
          const displayProject = project || (projectName ? { id: '', name: projectName, color: '#6b7280' } : null);

          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md"
            >
              <div className="text-lg flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {displayProject && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      📁 {displayProject.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};