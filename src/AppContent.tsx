import { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectPage } from './pages/ProjectPage';
import { ProjectModal } from './components/ProjectModal';
import { useProjects } from './hooks/useProjects';
import type { Project } from './types/todo';

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, addProject, updateProject } = useProjects();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const activeItem = useMemo(() => {
    if (location.pathname === '/') {
      return 'dashboard';
    } else if (location.pathname.startsWith('/project/')) {
      return location.pathname.split('/project/')[1];
    }
    return 'dashboard';
  }, [location.pathname]);

  const handleProjectClick = (projectId: string) => {
    if (projectId === 'dashboard') {
      navigate('/');
    } else if (projectId === 'inbox') {
      // Handle inbox - placeholder for notifications
      navigate('/');
    } else {
      // Navigate to project page
      navigate(`/project/${projectId}`);
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData.name, projectData.description, projectData.color);
    }
    setShowProjectModal(false);
  };

  return (
    <Layout
      projects={projects}
      onNewProject={handleNewProject}
      onProjectClick={handleProjectClick}
      activeItem={activeItem}
    >
      <Routes>
        <Route path="/" element={<Dashboard onNewProject={handleNewProject} />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />
      </Routes>

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleSaveProject}
        project={editingProject || undefined}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      />
    </Layout>
  );
};