'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Activity, TrendingUp, Clock } from 'lucide-react';

interface StatsData {
  totalUsers: { value: number; change: string };
  totalToolUses: { value: number; change: string };
  popularTool: { value: string; percentage: number };
  avgSessionTime: { value: number; change: string };
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch stats:', response.status, response.statusText);
          setStats(null);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load stats</div>;
  }

  const statItems = [
    {
      title: 'Total Users',
      value: stats.totalUsers.value.toLocaleString(),
      change: stats.totalUsers.change,
      icon: Users,
    },
    {
      title: 'Total Tool Uses',
      value: stats.totalToolUses.value.toLocaleString(),
      change: stats.totalToolUses.change,
      icon: Activity,
    },
    {
      title: 'Popular Tool',
      value: stats.popularTool.value,
      change: `${stats.popularTool.percentage}% of total`,
      icon: TrendingUp,
    },
    {
      title: 'Avg. Session Time',
      value: `${Math.floor(stats.avgSessionTime.value / 60)}m ${stats.avgSessionTime.value % 60}s`,
      change: stats.avgSessionTime.change,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}