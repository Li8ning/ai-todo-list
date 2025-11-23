import React from 'react';
import type { Project } from '../types/todo';
import { Card, CardHeader, CardTitle, CardContent } from './ui';
import { Button } from './ui';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  onCreateProject: () => void;
  projectStats: Record<string, { todoCount: number; completedCount: number }>;
}

export function ProjectSidebar({
  projects,
  selectedProjectId,
  onProjectSelect,
  onCreateProject,
  projectStats
}: ProjectSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Projects</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateProject}
            className="text-blue-600 hover:text-blue-700"
          >
            +
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* All Projects */}
          <button
            onClick={() => onProjectSelect('all')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedProjectId === 'all'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="font-medium">All Projects</span>
              </div>
              <span className="text-sm text-gray-500">
                {Object.values(projectStats).reduce((sum, stat) => sum + stat.todoCount, 0)}
              </span>
            </div>
          </button>

          {/* Individual Projects */}
          {projects.map(project => {
            const stats = projectStats[project.id] || { todoCount: 0, completedCount: 0 };
            return (
              <button
                key={project.id}
                onClick={() => onProjectSelect(project.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedProjectId === project.id
                    ? 'bg-opacity-20 text-gray-900 dark:text-gray-100'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                style={{
                  backgroundColor: selectedProjectId === project.id ? `${project.color}20` : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium truncate">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {stats.completedCount > 0 && (
                      <span className="text-green-600 dark:text-green-400">
                        {stats.completedCount}
                      </span>
                    )}
                    {stats.todoCount > stats.completedCount && (
                      <span className="text-gray-500">
                        {stats.todoCount - stats.completedCount}
                      </span>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {project.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}