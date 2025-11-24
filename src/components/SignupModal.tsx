import React, { useState } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await signup(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <ModalHeader>
        <ModalTitle>Create Account</ModalTitle>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                variant={error ? 'error' : 'default'}
                disabled={isSubmitting}
                required
              />
            </div>

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
                placeholder="Create a password"
                variant={error ? 'error' : 'default'}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>
        </ModalFooter>
      </form>

      <div className="px-6 pb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 font-medium"
            disabled={isSubmitting}
          >
            Sign in
          </button>
        </p>
      </div>
    </Modal>
  );
};