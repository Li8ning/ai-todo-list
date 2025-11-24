export type ActivityType =
  | 'todo_created'
  | 'todo_completed'
  | 'todo_incomplete'
  | 'todo_edited'
  | 'todo_deleted'
  | 'project_created'
  | 'project_edited'
  | 'project_deleted'
  | 'ai_generation'
  | 'bulk_operation'
  | 'login'
  | 'logout';

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}