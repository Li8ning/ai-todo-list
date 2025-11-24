import { useEffect } from 'react';
import { ActivityFeed } from '../components/ActivityFeed';

export const InboxPage = () => {
  useEffect(() => {
    document.title = "Inbox - AI TickUP";
  }, []);
  return (
    <div className="max-w-4xl mx-auto h-full">
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Inbox</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Your recent activity and updates</p>
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
};