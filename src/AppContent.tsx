import { useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectPage } from './pages/ProjectPage';
import { InboxPage } from './pages/InboxPage';
import { ProjectModal } from './components/ProjectModal';
import { LoginModal } from './components/LoginModal';
import { SignupModal } from './components/SignupModal';
import { useProjects } from './hooks/useProjects';
import { useAuth } from './hooks/useAuth';
import type { Project } from './types/todo';

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, addProject, updateProject } = useProjects();
  const { isAuthenticated, user } = useAuth();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const activeItem = useMemo(() => {
    if (location.pathname === '/') {
      return 'dashboard';
    } else if (location.pathname === '/inbox') {
      return 'inbox';
    } else if (location.pathname.startsWith('/project/')) {
      return location.pathname.split('/project/')[1];
    }
    return 'dashboard';
  }, [location.pathname]);

  const handleProjectClick = (projectId: string) => {
    if (projectId === 'dashboard') {
      navigate('/');
    } else if (projectId === 'inbox') {
      navigate('/inbox');
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

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginModal
          isOpen={showLoginModal || true} // Always show if not authenticated
          onClose={() => {}} // Prevent closing
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignupModal(true);
          }}
        />
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      </>
    );
  }

  return (
    <Layout
      projects={projects}
      onNewProject={handleNewProject}
      onProjectClick={handleProjectClick}
      activeItem={activeItem}
      user={user}
    >
      <Routes>
        <Route path="/" element={<Dashboard onNewProject={handleNewProject} />} />
        <Route path="/inbox" element={<InboxPage />} />
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