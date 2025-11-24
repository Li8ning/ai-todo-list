import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types/todo';
import { ProjectStorage } from '../services/projectStorage';
import { useActivities } from './useActivities';

export function useProjects(onProjectDelete?: (projectId: string) => void) {
  const { addActivity } = useActivities();
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

    // Log activity
    addActivity('project_created', `Created project: "${name}"`, { projectId: newProject.id });

    return newProject.id;
  }, [addActivity]);

  const updateProject = useCallback((id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'color'>>) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    setProjects(prev => prev.map(project =>
      project.id === id
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));

    // Log activity
    addActivity('project_edited', `Edited project: "${project.name}"`, { projectId: id });
  }, [projects, addActivity]);

  const deleteProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    // Call the cascade delete callback if provided
    onProjectDelete?.(id);

    setProjects(prev => prev.filter(project => project.id !== id));

    // Log activity
    addActivity('project_deleted', `Deleted project: "${project.name}"`, { projectId: id });
  }, [projects, onProjectDelete, addActivity]);

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