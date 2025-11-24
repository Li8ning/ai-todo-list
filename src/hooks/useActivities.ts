import { useState, useCallback } from 'react';
import type { Activity, ActivityType } from '../types/activity';
import { activityStorage } from '../services/activityStorage';
import { useAuth } from './useAuth';

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (user) {
      return activityStorage.getActivities(user.id);
    }
    return [];
  });

  const addActivity = useCallback((type: ActivityType, description: string, metadata?: Record<string, unknown>) => {
    if (!user) return;

    const activity: Activity = {
      id: crypto.randomUUID(),
      userId: user.id,
      type,
      description,
      timestamp: new Date(),
      metadata
    };

    activityStorage.addActivity(activity);
    setActivities(prev => [activity, ...prev]); // Add to beginning
  }, [user]);

  const clearActivities = useCallback(() => {
    if (!user) return;
    activityStorage.clearActivities(user.id);
    setActivities([]);
  }, [user]);

  return {
    activities,
    addActivity,
    clearActivities
  };
};