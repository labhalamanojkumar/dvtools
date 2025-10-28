'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileJson, Binary, Lock, Code2, Link2, Regex } from 'lucide-react';

interface Activity {
  id: string;
  toolType: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

const toolIcons: Record<string, { icon: any; color: string }> = {
  'JSON Formatter': { icon: FileJson, color: 'text-blue-500' },
  'Base64 Encoder': { icon: Binary, color: 'text-green-500' },
  'JWT Decoder': { icon: Lock, color: 'text-purple-500' },
  'Code Beautifier': { icon: Code2, color: 'text-orange-500' },
  'URL Encoder': { icon: Link2, color: 'text-cyan-500' },
  'Regexp Tester': { icon: Regex, color: 'text-red-500' },
};

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/tool-sessions?limit=10');
        if (response.ok) {
          const sessions = await response.json();
          setActivities(sessions);
        } else {
          console.error('Failed to fetch activity data:', response.status, response.statusText);
          setActivities([]);
        }
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest tool usage across the platform
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="mt-1 h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest tool usage across the platform
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest tool usage across the platform
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const toolName = activity.toolType.replace('_', ' ').toUpperCase();
            const toolConfig = toolIcons[toolName] || { icon: FileJson, color: 'text-gray-500' };
            const IconComponent = toolConfig.icon;

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`mt-1 ${toolConfig.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {toolName}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {formatTimestamp(activity.createdAt)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Used by {activity.user?.name || activity.user?.email || 'Anonymous'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}