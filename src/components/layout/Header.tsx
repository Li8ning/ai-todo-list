import React from 'react';
import { ThemeToggle, Input } from '../ui';
import { cn } from '../../utils/cn';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ className = '', onMenuClick }) => {
  return (
    <header className={cn('bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 mr-3"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search todos, projects..."
            leftIcon={<span>🔍</span>}
            className="w-full"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200">
            <span className="text-xl">🔔</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};