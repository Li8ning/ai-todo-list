import React from 'react';
import { cn } from '../../utils/cn';
import type { Project } from '../../types/todo';

interface SidebarProps {
  className?: string;
  projects: Project[];
  onNewProject?: () => void;
  onProjectClick?: (projectId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  className = '',
  projects,
  onNewProject,
  onProjectClick
}) => {
  return (
    <div className={cn('w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col', className)}>
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          AI Todo List
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => onProjectClick?.('dashboard')}
              className={cn(
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              <span className="mr-3 text-lg">🏠</span>
              Dashboard
            </button>
          </li>

          {/* Inbox */}
          <li>
            <button
              onClick={() => onProjectClick?.('inbox')}
              className={cn(
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              <span className="mr-3 text-lg">📥</span>
              Inbox
            </button>
          </li>

          {/* Projects Section */}
          <li className="pt-4">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Projects
            </div>
          </li>
          {projects.map((project) => (
            <li key={project.id}>
              <button
                onClick={() => onProjectClick?.(project.id)}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
              >
                <span className="mr-3 text-lg">📁</span>
                {project.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* New Project */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewProject}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <span className="mr-3 text-lg">➕</span>
          New Project
        </button>
      </div>
    </div>
  );
};