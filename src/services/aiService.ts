import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AIGeneratedTodo {
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

export interface AIGenerationOptions {
  style?: 'simple' | 'detailed' | 'step-by-step' | 'priority-based' | 'time-based';
}

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  async generateTodos(
    prompt: string,
    projectContext: {
      name: string;
      description?: string;
      existingTodos: Array<{ title: string; description?: string; priority: string }>;
    },
    options: AIGenerationOptions = {}
  ): Promise<AIGeneratedTodo[]> {
    const { style = 'simple' } = options;

    const systemPrompt = this.buildSystemPrompt(projectContext, style);
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAIResponse(text);
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate todos with AI. Please try again.');
    }
  }

  private buildSystemPrompt(
    projectContext: {
      name: string;
      description?: string;
      existingTodos: Array<{ title: string; description?: string; priority: string }>;
    },
    style: string
  ): string {
    const existingTodosText = projectContext.existingTodos.length > 0
      ? `\nExisting todos in this project:\n${projectContext.existingTodos.map(todo =>
          `- ${todo.title}${todo.description ? ` (${todo.description})` : ''} [${todo.priority}]`
        ).join('\n')}`
      : '';

    const styleInstructions = {
      simple: 'Create concise, actionable todo items.',
      detailed: 'Create detailed todo items with comprehensive descriptions.',
      'step-by-step': 'Break down the request into sequential, logical steps.',
      'priority-based': 'Focus on high-impact tasks and assign appropriate priorities.',
      'time-based': 'Suggest todos with realistic time estimates and scheduling.'
    };

    return `You are an AI assistant that helps create structured todo lists for projects.

Project: ${projectContext.name}
${projectContext.description ? `Description: ${projectContext.description}` : ''}
${existingTodosText}

Style: ${styleInstructions[style as keyof typeof styleInstructions] || styleInstructions.simple}

Instructions:
- Generate relevant todo items based on the user's request
- Each todo should have a clear, actionable title
- Include a brief description when helpful
- Assign priority: high, medium, or low
- Optionally suggest due dates in ISO format (YYYY-MM-DD) when relevant
- Format your response as a JSON array of objects with keys: title, description (optional), priority, dueDate (optional)
- Ensure todos are relevant to the project context
- Avoid duplicating existing todos

Response format example:
[
  {
    "title": "Research competitors",
    "description": "Analyze top 5 competitors in the market",
    "priority": "high",
    "dueDate": "2024-01-15"
  }
]`;
  }

  private parseAIResponse(response: string): AIGeneratedTodo[] {
    try {
      // Try to extract JSON from markdown code blocks first
      const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);

      let jsonString = codeBlockMatch ? codeBlockMatch[1].trim() : response;

      // If no code block, try to find JSON array directly
      if (!codeBlockMatch) {
        const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No JSON array found in response');
        }
        jsonString = jsonMatch[0];
      }

      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }

      return parsed.map((item: unknown) => {
        const todoItem = item as Record<string, unknown>;
        if (!todoItem.title || typeof todoItem.title !== 'string') {
          throw new Error('Invalid todo item: missing or invalid title');
        }

        const todo: AIGeneratedTodo = {
          title: todoItem.title.trim(),
          priority: ['high', 'medium', 'low'].includes(todoItem.priority as string) ? todoItem.priority as 'high' | 'medium' | 'low' : 'medium'
        };

        if (todoItem.description && typeof todoItem.description === 'string') {
          todo.description = todoItem.description.trim();
        }

        // Note: Due dates are not included in AI-generated todos
        // Users can add them manually in the review modal if needed

        return todo;
      });
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback: try to extract todos from plain text
      return this.parseFallbackResponse(response);
    }
  }

  private parseFallbackResponse(response: string): AIGeneratedTodo[] {
    // Simple fallback parser for non-JSON responses
    const lines = response.split('\n').filter(line => line.trim());
    const todos: AIGeneratedTodo[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
        const title = trimmed.replace(/^[-•\d.\s]*/, '').trim();
        if (title) {
          todos.push({
            title,
            priority: 'medium'
          });
        }
      }
    }

    return todos.slice(0, 5); // Limit to 5 todos
  }
}

// Factory function to create AI service instance
export const createAIService = (apiKey?: string): AIService | null => {
  const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.warn('Gemini API key not found. AI features will be disabled.');
    return null;
  }
  return new AIService(key);
};