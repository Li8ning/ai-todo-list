import { useState, useMemo, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { InboxPage } from './pages/InboxPage';
import { ToastContainer, Spinner } from './components/ui';
import { useProjects } from './hooks/useProjects';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import type { Project } from './types/todo';

// Lazy load heavy components
const ProjectPage = lazy(() => import('./pages/ProjectPage').then(module => ({ default: module.ProjectPage })));
const ProjectModal = lazy(() => import('./components/ProjectModal').then(module => ({ default: module.ProjectModal })));
const LoginModal = lazy(() => import('./components/LoginModal').then(module => ({ default: module.LoginModal })));
const SignupModal = lazy(() => import('./components/SignupModal').then(module => ({ default: module.SignupModal })));

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, addProject, updateProject } = useProjects();
  const { isAuthenticated, user } = useAuth();
  const { toasts, removeToast } = useToast();
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
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
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>}>
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
        <Suspense fallback={<Spinner />}>
          <ProjectModal
            isOpen={showProjectModal}
            onClose={() => setShowProjectModal(false)}
            onSave={handleSaveProject}
            project={editingProject || undefined}
            title={editingProject ? 'Edit Project' : 'Create New Project'}
          />
        </Suspense>
      </Layout>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </Suspense>
  );
};