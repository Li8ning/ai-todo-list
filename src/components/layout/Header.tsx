import React from 'react';
import { ThemeToggle } from '../ui';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import type { User } from '../../types/auth';

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  className = '',
  onMenuClick,
  user
}) => {
  const { logout } = useAuth();
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

        {/* Spacer for center alignment */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {user?.name || 'User'}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};