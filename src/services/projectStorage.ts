import type { Project } from '../types/todo';

const PROJECTS_STORAGE_KEY = 'ai-todo-list-projects';

export class ProjectStorage {
  static getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored) as (Omit<Project, 'createdAt' | 'updatedAt'> & {
        createdAt: string;
        updatedAt: string;
      })[];
      // Convert date strings back to Date objects
      return parsed.map((project): Project => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      return [];
    }
  }

  static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }

  static generateId(): string {
    return 'project_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getDefaultProjects(): Project[] {
    return [
      {
        id: 'inbox',
        name: 'Inbox',
        description: 'Default project for uncategorized todos',
        color: '#6b7280',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}