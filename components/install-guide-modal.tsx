'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Monitor,
  Tablet,
  Chrome,
  Globe,
  ExternalLink,
  CheckCircle2,
  Download,
  ArrowRight,
} from 'lucide-react';
import { DeviceInfo, getInstallInstructions, getRecommendedBrowser } from '@/lib/device-detection';

interface InstallGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceInfo: DeviceInfo;
}

export function InstallGuideModal({ open, onOpenChange, deviceInfo }: InstallGuideModalProps) {
  const instructions = getInstallInstructions(deviceInfo);
  const recommendedBrowser = getRecommendedBrowser(deviceInfo);

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'chrome': return <Chrome className="h-4 w-4" />;
      case 'safari': return <Globe className="h-4 w-4" />;
      case 'firefox': return <Globe className="h-4 w-4" />;
      case 'edge': return <Globe className="h-4 w-4" />;
      case 'samsung': return <Globe className="h-4 w-4" />;
      case 'brave': return <Globe className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="h-5 w-5" />;
    if (deviceInfo.isTablet) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const getBrowserSpecificInstructions = () => {
    if (instructions.browserSpecific && deviceInfo.browser !== 'unknown') {
      const browserKey = deviceInfo.browser;
      if (instructions.browserSpecific[browserKey]) {
        return instructions.browserSpecific[browserKey];
      }
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {getDeviceIcon()}
            <DialogTitle className="text-xl">{instructions.title}</DialogTitle>
            <Badge variant="outline" className="ml-auto">
              {deviceInfo.os} • {deviceInfo.browser}
            </Badge>
          </div>
          <DialogDescription className="text-base">
            Follow these simple steps to install DvTools on your {deviceInfo.type}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Device Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {deviceInfo.isMobile ? <Smartphone className="h-6 w-6" /> : 
                 deviceInfo.isTablet ? <Tablet className="h-6 w-6" /> : 
                 <Monitor className="h-6 w-6" />}
              </div>
              <p className="text-xs text-muted-foreground">Device</p>
              <p className="font-medium capitalize">{deviceInfo.type}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getBrowserIcon(deviceInfo.browser)}
              </div>
              <p className="text-xs text-muted-foreground">Browser</p>
              <p className="font-medium capitalize">{deviceInfo.browser}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground">PWA Support</p>
              <p className="font-medium">{deviceInfo.supportsPWA ? 'Yes' : 'Limited'}</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Download className="h-6 w-6" />
              </div>
              <p className="text-xs text-muted-foreground">Can Install</p>
              <p className="font-medium">{deviceInfo.canInstall ? 'Yes' : 'Manual'}</p>
            </div>
          </div>

          {/* Install Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Installation Steps
            </h3>
            
            <div className="space-y-3">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {/* Browser-specific instructions */}
            {getBrowserSpecificInstructions() && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  {getBrowserIcon(deviceInfo.browser)}
                  <h4 className="font-medium capitalize">{deviceInfo.browser} Specific Instructions</h4>
                </div>
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {getBrowserSpecificInstructions()}
                </pre>
              </div>
            )}
          </div>

          {/* Recommended Browser */}
          {recommendedBrowser && (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium mb-2">💡 Recommended Browser</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For the best experience, consider using:
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <strong>{recommendedBrowser.name}</strong>
                  <Button size="sm" variant="outline" asChild>
                    <a 
                      href={recommendedBrowser.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      Download <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
              <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                {recommendedBrowser.reasons.map((reason, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Features after install */}
          <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border">
            <h4 className="font-medium mb-2">🚀 What you get after install:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Fast app-like performance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Offline functionality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Native home screen icon</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Full-screen experience</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={() => {
                if ((window as any).deferredPrompt) {
                  (window as any).deferredPrompt.prompt();
                }
                onOpenChange(false);
              }}
              className="flex-1"
              disabled={!deviceInfo.canInstall}
            >
              <Download className="mr-2 h-4 w-4" />
              {deviceInfo.isStandalone ? 'Already Installed' : 
               deviceInfo.canInstall ? 'Install Now' : 'Try Manual Install'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}