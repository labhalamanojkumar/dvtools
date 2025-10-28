'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Code,
  Key,
  Download,
  Settings,
  Zap,
  Database,
  TestTube,
  Hash
} from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const quickActions = [
    {
      title: 'Format JSON',
      description: 'Validate and format JSON data',
      icon: FileText,
      href: '/tools/json-formatter',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Encode Base64',
      description: 'Convert text to Base64 encoding',
      icon: Code,
      href: '/tools/base64-encoder',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Decode JWT',
      description: 'Decode and verify JWT tokens',
      icon: Key,
      href: '/tools/jwt-decoder',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      title: 'Test RegExp',
      description: 'Test and debug regular expressions',
      icon: TestTube,
      href: '/tools/regexp-tester',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    },
    {
      title: 'Generate Hash',
      description: 'Create MD5, SHA-256, and other hashes',
      icon: Hash,
      href: '/tools/hash-generator',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950'
    },
    {
      title: 'Encode URL',
      description: 'URL encode and decode strings',
      icon: Link,
      href: '/tools/url-encoder',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950'
    }
  ];

  const accountActions = [
    {
      title: 'Manage API Keys',
      description: 'Create and manage your API keys',
      icon: Key,
      // Use anchored link to avoid 404; main settings page contains the section
      href: '/settings#api-keys',
      variant: 'outline' as const
    },
    {
      title: 'Export Data',
      description: 'Download your usage data',
      icon: Download,
      href: '/settings#export',
      variant: 'outline' as const
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      icon: Settings,
      href: '/profile',
      variant: 'outline' as const
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="block p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <div className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Account Management</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {accountActions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant={action.variant}
                  className="justify-start"
                >
                  <Link href={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}