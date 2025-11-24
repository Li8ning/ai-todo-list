import { useState } from 'react';
import { Button } from './ui/Button';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal';
import { createAIService } from '../services/aiService';
import { useActivities } from '../hooks/useActivities';
import { useToast } from '../hooks/useToast';
import type { AIGeneratedTodo, AIGenerationOptions } from '../services/aiService';
import type { Project, Todo } from '../types/todo';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  existingTodos: Todo[];
  onTodosGenerated: (todos: AIGeneratedTodo[]) => void;
}

export function AIPromptModal({
  isOpen,
  onClose,
  project,
  existingTodos,
  onTodosGenerated
}: AIPromptModalProps) {
  const { addActivity } = useActivities();
  const { error: showError } = useToast();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<AIGenerationOptions['style']>('simple');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const aiService = createAIService();
      if (!aiService) {
        throw new Error('AI service not available. Please check your API key configuration.');
      }

      const projectContext = {
        name: project.name,
        description: project.description,
        existingTodos: existingTodos.map(todo => ({
          title: todo.title,
          description: todo.description,
          priority: todo.priority
        }))
      };

      const options: AIGenerationOptions = {
        style
      };

      const generatedTodos = await aiService.generateTodos(prompt, projectContext, options);
      onTodosGenerated(generatedTodos);
      addActivity('ai_generation', `Generated ${generatedTodos.length} todos with AI for "${project.name}"`, { projectId: project.id });
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to generate todos');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setPrompt('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>
        <ModalTitle>Generate Todos with AI</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <div className="space-y-4">
          {/* Project Context */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Project Context
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Project:</strong> {project.name}</p>
              {project.description && (
                <p><strong>Description:</strong> {project.description}</p>
              )}
              <p><strong>Existing todos:</strong> {existingTodos.length}</p>
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What would you like to accomplish?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Plan a marketing campaign, organize a team meeting, develop a new feature..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          {/* Generation Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generation Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as AIGenerationOptions['style'])}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            >
              <option value="simple">Simple Tasks</option>
              <option value="detailed">Detailed Tasks</option>
              <option value="step-by-step">Step-by-Step</option>
              <option value="priority-based">Priority-Based</option>
              <option value="time-based">Time-Based</option>
            </select>
          </div>


          {/* Loading State */}
          {isGenerating && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Generating todos with AI...
                </p>
              </div>
            </div>
          )}
        </div>
      </ModalContent>
      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Todos'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}