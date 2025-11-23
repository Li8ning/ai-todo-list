import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types/todo';
import { ProjectStorage } from '../services/projectStorage';

export function useProjects(onProjectDelete?: (projectId: string) => void) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = ProjectStorage.getProjects();
    return stored.length > 0 ? stored : ProjectStorage.getDefaultProjects();
  });

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    ProjectStorage.saveProjects(projects);
  }, [projects]);

  const addProject = useCallback((name: string, description?: string, color: string = '#3b82f6') => {
    const newProject: Project = {
      id: ProjectStorage.generateId(),
      name,
      description,
      color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>) => {
    setProjects(prev => prev.map(project =>
      project.id === id
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
  }, []);

  const deleteProject = useCallback((id: string) => {
    // Don't allow deleting the inbox project
    if (id === 'inbox') return;

    // Call the cascade delete callback if provided
    onProjectDelete?.(id);

    setProjects(prev => prev.filter(project => project.id !== id));
  }, [onProjectDelete]);

  const getProjectById = useCallback((id?: string) => {
    if (!id) return undefined;
    return projects.find(project => project.id === id);
  }, [projects]);

  const getProjectStats = useCallback((projectId: string) => {
    // This will be used later when we integrate with todos
    return {
      id: projectId,
      name: getProjectById(projectId)?.name || 'Unknown',
      color: getProjectById(projectId)?.color || '#6b7280',
      todoCount: 0, // Will be calculated when integrated
    };
  }, [getProjectById]);

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectStats,
  };
}