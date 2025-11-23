import { useState, useEffect, useCallback } from 'react';
import type { SavedFilter, TodoFilter } from '../types/todo';
import { FilterStorage } from '../services/filterStorage';

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => FilterStorage.getSavedFilters());

  // Save filters to localStorage whenever savedFilters change
  useEffect(() => {
    FilterStorage.saveFilters(savedFilters);
  }, [savedFilters]);

  const saveFilter = useCallback((name: string, filter: TodoFilter) => {
    const newFilter: SavedFilter = {
      id: FilterStorage.generateId(),
      name,
      filter: { ...filter }, // Create a copy
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSavedFilters(prev => [...prev, newFilter]);
    return newFilter.id;
  }, []);

  const updateFilter = useCallback((id: string, name: string, filter: TodoFilter) => {
    setSavedFilters(prev => prev.map(savedFilter =>
      savedFilter.id === id
        ? { ...savedFilter, name, filter: { ...filter }, updatedAt: new Date() }
        : savedFilter
    ));
  }, []);

  const deleteFilter = useCallback((id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  }, []);

  const getFilterById = useCallback((id: string) => {
    return savedFilters.find(filter => filter.id === id);
  }, [savedFilters]);

  return {
    savedFilters,
    saveFilter,
    updateFilter,
    deleteFilter,
    getFilterById,
  };
}