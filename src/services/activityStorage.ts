import type { Activity, ActivityType } from '../types/activity';

const ACTIVITIES_KEY = 'ai-todo-activities';

export const activityStorage = {
  // Get all activities for a user
  getActivities(userId: string): Activity[] {
    try {
      const activities = localStorage.getItem(ACTIVITIES_KEY);
      if (!activities) return [];

      const parsed = JSON.parse(activities) as { id: string; userId: string; type: string; description: string; timestamp: string; metadata?: unknown }[];
      return parsed
        .filter(activity => activity.userId === userId)
        .map(activity => ({
          ...activity,
          type: activity.type as ActivityType,
          timestamp: new Date(activity.timestamp),
          metadata: activity.metadata as Record<string, unknown> | undefined
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Most recent first
    } catch {
      return [];
    }
  },

  // Add a new activity
  addActivity(activity: Activity): void {
    try {
      const activities = this.getAllActivities();
      activities.push(activity);
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    } catch {
      // Ignore errors
    }
  },

  // Get all activities (internal)
  getAllActivities(): Activity[] {
    try {
      const activities = localStorage.getItem(ACTIVITIES_KEY);
      if (!activities) return [];

      const parsed = JSON.parse(activities) as { id: string; userId: string; type: ActivityType; description: string; timestamp: string; metadata?: Record<string, unknown> }[];
      return parsed.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    } catch {
      return [];
    }
  },

  // Clear activities for a user (optional)
  clearActivities(userId: string): void {
    const allActivities = this.getAllActivities();
    const filtered = allActivities.filter(activity => activity.userId !== userId);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(filtered));
  }
};