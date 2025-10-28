'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export default function UsageStats() {
  // Mock data - in a real app, this would come from your database
  const stats = [
    {
      tool: 'JSON Formatter',
      calls: 45,
      change: '+12%',
      trend: 'up',
      color: 'bg-blue-500'
    },
    {
      tool: 'Base64 Encoder',
      calls: 32,
      change: '+8%',
      trend: 'up',
      color: 'bg-green-500'
    },
    {
      tool: 'JWT Decoder',
      calls: 28,
      change: '-3%',
      trend: 'down',
      color: 'bg-purple-500'
    },
    {
      tool: 'RegExp Tester',
      calls: 18,
      change: '+15%',
      trend: 'up',
      color: 'bg-orange-500'
    },
    {
      tool: 'URL Encoder',
      calls: 15,
      change: '+5%',
      trend: 'up',
      color: 'bg-red-500'
    },
    {
      tool: 'Hash Generator',
      calls: 7,
      change: '+2%',
      trend: 'up',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-sm font-medium">{stat.tool}</p>
                  <p className="text-xs text-muted-foreground">{stat.calls} calls</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Monthly Usage</span>
            <span className="text-sm text-muted-foreground">145 / 300</span>
          </div>
          <Progress value={48.3} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            48.3% of monthly limit used
          </p>
        </div>
      </CardContent>
    </Card>
  );
}