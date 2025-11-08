'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  X,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { useDeviceDetection, getInstallInstructions } from '@/lib/device-detection';
import { InstallGuideModal } from './install-guide-modal';

interface InstallBannerProps {
  position?: 'top' | 'bottom';
  variant?: 'default' | 'minimal' | 'detailed';
  showDeviceInfo?: boolean;
  className?: string;
}

export function InstallBanner({ 
  position = 'bottom', 
  variant = 'default',
  showDeviceInfo = true,
  className = ''
}: InstallBannerProps) {
  const deviceInfo = useDeviceDetection();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissedBanner = localStorage.getItem('install-banner-dismissed');
    if (dismissedBanner) {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if ((window as any).deferredPrompt) {
      (window as any).deferredPrompt.prompt();
      const { outcome } = await (window as any).deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      (window as any).deferredPrompt = null;
    } else {
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (dismissed || (!deviceInfo.canInstall && !showInstallPrompt)) {
    return null;
  }

  const instructions = getInstallInstructions(deviceInfo);
  const deviceIcon = deviceInfo.isMobile ? Smartphone : deviceInfo.isTablet ? Tablet : Monitor;
  const PositionIcon = deviceIcon;

  if (variant === 'minimal') {
    return (
      <>
        <div className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg ${className}`}>
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PositionIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Install DvTools</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={handleInstall}
                  className="text-xs"
                >
                  Install
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <InstallGuideModal 
          open={showModal} 
          onOpenChange={setShowModal}
          deviceInfo={deviceInfo}
        />
      </>
    );
  }

  return (
    <>
      <div className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground shadow-xl border-b border-white/10 ${className}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Download className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Install DvTools App</h3>
                  {showDeviceInfo && (
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      <PositionIcon className="mr-1 h-3 w-3" />
                      {deviceInfo.type}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/80">
                  {deviceInfo.isStandalone 
                    ? 'Running as standalone app' 
                    : deviceInfo.isIOS 
                      ? 'Add to Home Screen for quick access'
                      : deviceInfo.isAndroid
                        ? `Install for ${deviceInfo.browser} browser`
                        : 'Get app-like experience on your device'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleInstall}
                className="bg-white text-primary hover:bg-white/90"
              >
                {deviceInfo.isStandalone ? 'Installed' : 'Install'}
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowModal(true)}
                className="text-white hover:bg-white/20"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <InstallGuideModal 
        open={showModal} 
        onOpenChange={setShowModal}
        deviceInfo={deviceInfo}
      />
    </>
  );
}

// Hook to check if banner should be shown
export function useInstallBanner() {
  const deviceInfo = useDeviceDetection();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedBanner = localStorage.getItem('install-banner-dismissed');
    setDismissed(!!dismissedBanner);
  }, []);

  const canShow = deviceInfo.canInstall && !dismissed;
  const shouldShow = deviceInfo.supportsPWA && !deviceInfo.isStandalone;

  return {
    canShow,
    shouldShow,
    deviceInfo,
    dismiss: () => {
      setDismissed(true);
      localStorage.setItem('install-banner-dismissed', 'true');
    }
  };
}