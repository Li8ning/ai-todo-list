import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setEmail('');
      setPassword('');
      setError('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <ModalHeader>
        <ModalTitle>Welcome Back</ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                variant={error ? 'error' : 'default'}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                variant={error ? 'error' : 'default'}
                disabled={isSubmitting}
                required
              />
            </div>

            {error && (
              <div className="text-error-600 text-sm">
                {error}
              </div>
            )}
          </div>
        </ModalContent>

        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || isLoading}
            fullWidth
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </ModalFooter>
      </form>

      <div className="px-6 pb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary-600 hover:text-primary-700 font-medium"
            disabled={isSubmitting}
          >
            Sign up
          </button>
        </p>
      </div>
    </Modal>
  );
};