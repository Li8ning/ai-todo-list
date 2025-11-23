import type { SavedFilter } from '../types/todo';

const FILTERS_STORAGE_KEY = 'ai-todo-list-saved-filters';

export class FilterStorage {
  static getSavedFilters(): SavedFilter[] {
    try {
      const stored = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored) as (Omit<SavedFilter, 'createdAt' | 'updatedAt'> & {
        createdAt: string;
        updatedAt: string;
      })[];

      return parsed.map((filter): SavedFilter => ({
        ...filter,
        createdAt: new Date(filter.createdAt),
        updatedAt: new Date(filter.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading saved filters from localStorage:', error);
      return [];
    }
  }

  static saveFilters(filters: SavedFilter[]): void {
    try {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  }

  static generateId(): string {
    return 'filter_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}