import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../utils/cn';
import type { Project } from '../../types/todo';
import type { User } from '../../types/auth';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  projects: Project[];
  onNewProject?: () => void;
  onProjectClick?: (projectId: string) => void;
  activeItem?: string;
  user?: User | null;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  projects,
  onNewProject,
  onProjectClick,
  activeItem,
  user
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed lg:left-0 lg:top-0 lg:h-screen',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar
            projects={projects}
            onNewProject={onNewProject}
            onProjectClick={onProjectClick}
            activeItem={activeItem}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            className="lg:ml-64"
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
          />
          <main className={cn('flex-1 p-2 sm:p-4 lg:ml-64', className)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};