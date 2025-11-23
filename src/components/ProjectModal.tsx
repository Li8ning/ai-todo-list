import React, { useState } from 'react';
import type { Project } from '../types/todo';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter, Button, Input } from './ui';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  project?: Project;
  title: string;
}

const PROJECT_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

export function ProjectModal({ isOpen, onClose, onSave, project, title }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName(project?.name || '');
      setDescription(project?.description || '');
      setColor(project?.color || PROJECT_COLORS[0]);
    }
  }, [isOpen, project]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter project name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((colorOption) => (
                <button
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption
                      ? 'border-gray-900 dark:border-gray-100 scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  aria-label={`Select color ${colorOption}`}
                />
              ))}
            </div>
          </div>
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!name.trim()}>
          Save Project
        </Button>
      </ModalFooter>
    </Modal>
  );
}