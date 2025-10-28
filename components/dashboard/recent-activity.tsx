"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Code, Key, Download } from "lucide-react";

export default function RecentActivity() {
  // Mock data - in a real app, this would come from your database
  const activities = [
    {
      id: 1,
      action: "Formatted JSON",
      tool: "JSON Formatter",
      timestamp: "2 minutes ago",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      id: 2,
      action: "Generated API Key",
      tool: "API Management",
      timestamp: "15 minutes ago",
      icon: Key,
      color: "text-green-500",
    },
    {
      id: 3,
      action: "Decoded JWT",
      tool: "JWT Decoder",
      timestamp: "1 hour ago",
      icon: Code,
      color: "text-purple-500",
    },
    {
      id: 4,
      action: "Exported Data",
      tool: "Data Export",
      timestamp: "2 hours ago",
      icon: Download,
      color: "text-orange-500",
    },
    {
      id: 5,
      action: "Tested RegExp",
      tool: "RegExp Tester",
      timestamp: "3 hours ago",
      icon: Code,
      color: "text-red-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-1 rounded ${activity.color} bg-opacity-10`}>
                <activity.icon className={`h-3 w-3 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.tool}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Showing last 5 activities
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
