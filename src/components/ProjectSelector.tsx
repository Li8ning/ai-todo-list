import type { Project } from '../types/todo';
import { Badge } from './ui';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId?: string;
  onProjectChange: (projectId: string) => void;
  className?: string;
}

export function ProjectSelector({ projects, selectedProjectId, onProjectChange, className = '' }: ProjectSelectorProps) {

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {projects.map(project => (
        <button
          key={project.id}
          onClick={() => onProjectChange(project.id)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
            selectedProjectId === project.id
              ? 'bg-opacity-20 text-gray-900 dark:text-gray-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
          style={{
            backgroundColor: selectedProjectId === project.id ? `${project.color}20` : 'transparent',
            border: selectedProjectId === project.id ? `1px solid ${project.color}` : '1px solid transparent'
          }}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <span className="truncate max-w-24">{project.name}</span>
        </button>
      ))}
    </div>
  );
}

interface ProjectBadgeProps {
  project?: Project;
  className?: string;
}

export function ProjectBadge({ project, className = '' }: ProjectBadgeProps) {
  if (!project) return null;

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 text-xs sm:text-xs px-2.5 py-1 ${className}`}
      style={{
        backgroundColor: `${project.color}20`,
        borderColor: project.color,
        color: project.color
      }}
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: project.color }}
      />
      <span className="truncate max-w-[120px] sm:max-w-none">{project.name}</span>
    </Badge>
  );
}