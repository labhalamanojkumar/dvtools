import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface ToolSession {
  id: string;
  userId?: string;
  toolType: string;
  duration?: number;
  success: boolean;
  createdAt: Date;
}

export interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  activeToday: number;
  toolUsage: {
    toolType: string;
    _count: number;
  }[];
}

export interface SEOReport {
  id: string;
  page: string;
  title?: string;
  description?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  performanceScore?: number;
  accessibilityScore?: number;
  seoScore?: number;
  reportDate: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: Date;
}
