import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectPage } from './pages/ProjectPage';
import { ProjectModal } from './components/ProjectModal';
import { useProjects } from './hooks/useProjects';
import type { Project } from './types/todo';

function App() {
  const { projects, addProject, updateProject } = useProjects();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleProjectClick = (projectId: string) => {
    if (projectId === 'dashboard') {
      // Navigate to dashboard - handled by router
    } else if (projectId === 'inbox') {
      // Handle inbox - for now, just navigate to dashboard
    } else {
      // Navigate to project page - handled by router
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
    <Router>
      <Layout
        projects={projects}
        onNewProject={handleNewProject}
        onProjectClick={handleProjectClick}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
    </Router>
  );
}

export default App;
