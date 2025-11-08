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
  Zap,
} from 'lucide-react';
import { useDeviceDetection } from '@/lib/device-detection';
import { InstallGuideModal } from './install-guide-modal';

interface FloatingInstallButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showBadge?: boolean;
  className?: string;
}

export function FloatingInstallButton({ 
  position = 'bottom-right', 
  showBadge = true,
  className = ''
}: FloatingInstallButtonProps) {
  const deviceInfo = useDeviceDetection();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if button was previously dismissed
    const dismissedButton = localStorage.getItem('install-button-dismissed');
    if (dismissedButton) {
      setDismissed(true);
    } else {
      // Show button after a delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      setIsVisible(true);
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
      setIsVisible(false);
    } else {
      setShowModal(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
    localStorage.setItem('install-button-dismissed', 'true');
  };

  // Don't show if already dismissed or if no PWA support
  if (dismissed || !isVisible || deviceInfo.isStandalone) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default: // bottom-right
        return 'bottom-4 right-4';
    }
  };

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="h-4 w-4" />;
    if (deviceInfo.isTablet) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <>
      <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
        <div className="relative group">
          <Button
            onClick={handleInstall}
            size="lg"
            className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            aria-label="Install DvTools App"
          >
            <Download className="h-5 w-5" />
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            <div className="font-medium">Install DvTools</div>
            <div className="text-xs text-gray-300">
              {deviceInfo.isIOS 
                ? 'Add to Home Screen' 
                : deviceInfo.canInstall 
                  ? 'Get app-like experience' 
                  : 'Learn how to install'
              }
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>

          {/* Dismiss Button */}
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gray-500 hover:bg-gray-600 text-white p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Dismiss install button"
          >
            <X className="h-3 w-3" />
          </Button>

          {/* Badge */}
          {showBadge && deviceInfo.canInstall && (
            <Badge className="absolute -top-2 -left-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 animate-pulse">
              <Zap className="h-3 w-3" />
            </Badge>
          )}
        </div>

        {/* Additional info for mobile */}
        {deviceInfo.isMobile && (
          <div className="absolute bottom-full right-0 mb-12 w-64 p-3 bg-black/90 text-white text-xs rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="flex items-center gap-2 mb-2">
              {getDeviceIcon()}
              <span className="font-medium">Device: {deviceInfo.type}</span>
            </div>
            <p className="text-gray-300">
              {deviceInfo.isIOS 
                ? 'iOS Safari: Tap Share → Add to Home Screen'
                : deviceInfo.browser === 'chrome'
                  ? 'Chrome: Menu → Add to Home Screen'
                  : `Browser: ${deviceInfo.browser} - Check menu for install option`
              }
            </p>
          </div>
        )}
      </div>
      
      <InstallGuideModal 
        open={showModal} 
        onOpenChange={setShowModal}
        deviceInfo={deviceInfo}
      />
    </>
  );
}

// Simplified hook for checking button visibility
export function useFloatingInstallButton() {
  const deviceInfo = useDeviceDetection();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedButton = localStorage.getItem('install-button-dismissed');
    setDismissed(!!dismissedButton);
  }, []);

  return {
    canShow: deviceInfo.supportsPWA && !deviceInfo.isStandalone && !dismissed,
    deviceInfo,
    dismiss: () => {
      setDismissed(true);
      localStorage.setItem('install-button-dismissed', 'true');
    }
  };
}