'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Bell,
  Moon,
  Globe,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface AccountSettingsProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
  isAdmin: boolean;
}

export default function AccountSettings({ user, isAdmin }: AccountSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm">
                Email notifications
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="usage-alerts" className="text-sm">
                Usage limit alerts
              </Label>
              <Switch id="usage-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="security-alerts" className="text-sm">
                Security alerts
              </Label>
              <Switch id="security-alerts" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        {/* Appearance */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Appearance
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm">
                Dark mode
              </Label>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view" className="text-sm">
                Compact view
              </Label>
              <Switch id="compact-view" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Privacy
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="text-sm">
                Analytics tracking
              </Label>
              <Switch id="analytics" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile" className="text-sm">
                Public profile
              </Label>
              <Switch id="public-profile" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Data Management */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Management
          </h4>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export my data
            </Button>
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <Download className="mr-2 h-4 w-4" />
              Download usage report
            </Button>
          </div>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="space-y-4">
          <h4 className="font-medium text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </h4>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These actions cannot be undone. Please be certain before proceeding.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete all API keys
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete account
            </Button>
          </div>
        </div>

        {isAdmin && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium text-primary flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrator
              </h4>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Access Admin Panel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}