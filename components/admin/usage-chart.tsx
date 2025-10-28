"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ToolUsage {
  name: string;
  uses: number;
  percentage: number;
}

export function UsageChart() {
  const [data, setData] = useState<ToolUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/tool-sessions?type=chart");
        if (response.ok) {
          const chartData = await response.json();
          // Transform the data for the chart
          const toolCounts: Record<string, number> = {};
          chartData.forEach((day: any) => {
            Object.keys(day).forEach((key) => {
              if (key !== "date") {
                toolCounts[key] = (toolCounts[key] || 0) + day[key];
              }
            });
          });

          const usageData = Object.entries(toolCounts).map(([name, uses]) => ({
            name: name.replace(/_/g, " ").toUpperCase(),
            uses,
            percentage: Math.round(
              (uses / Object.values(toolCounts).reduce((a, b) => a + b, 0)) *
                100,
            ),
          }));

          setData(usageData);
        } else {
          console.error(
            "Failed to fetch usage data:",
            response.status,
            response.statusText,
          );
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch usage data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tool Usage Statistics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Number of times each tool has been used this month
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tool Usage Statistics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Number of times each tool has been used this month
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No usage data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool Usage Statistics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Number of times each tool has been used this month
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "uses" ? `${value} uses` : `${value}%`,
                  name === "uses" ? "Uses" : "Percentage",
                ]}
                labelStyle={{ color: "#000" }}
              />
              <Bar dataKey="uses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
