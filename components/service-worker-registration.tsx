'use client';

import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  canInstall: boolean;
  deferredPrompt: any;
}

export function ServiceWorkerRegistration() {
  const [state, setState] = useState<ServiceWorkerState>({
    isRegistered: false,
    isUpdateAvailable: false,
    canInstall: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      registerServiceWorker();
      
      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
      
      // Handle beforeinstallprompt
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Handle app installed
      window.addEventListener('appinstalled', handleAppInstalled);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered successfully:', registration);
      
      setState(prev => ({ ...prev, isRegistered: true }));
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, isUpdateAvailable: true }));
            }
          });
        }
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'INSTALL_PROMPT_AVAILABLE':
        setState(prev => ({ ...prev, canInstall: true }));
        break;
      case 'APP_INSTALLED':
        console.log('App was installed');
        setState(prev => ({ ...prev, canInstall: false }));
        break;
      case 'CACHE_STATUS':
        console.log('Cache status:', data);
        break;
    }
  };

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault();
    const deferredPrompt = event as any;
    setState(prev => ({ ...prev, deferredPrompt }));
    setState(prev => ({ ...prev, canInstall: true }));
  };

  const handleAppInstalled = () => {
    console.log('PWA was installed');
    setState(prev => ({ 
      ...prev, 
      canInstall: false,
      deferredPrompt: null 
    }));
  };

  // Function to trigger install prompt
  const installApp = async () => {
    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      setState(prev => ({ 
        ...prev, 
        deferredPrompt: null,
        canInstall: false 
      }));
    }
  };

  // Function to update service worker
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  // Function to get cache status
  const getCacheStatus = async () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'GET_CACHE_STATUS'
      });
    }
  };

  // Log service worker state for debugging
  useEffect(() => {
    console.log('Service Worker State:', state);
  }, [state]);

  return null; // This component doesn't render anything
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone);

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const deferredPrompt = e as any;
      setInstallPrompt(deferredPrompt);
      setCanInstall(true);
    };
    
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setInstallPrompt(null);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      
      setInstallPrompt(null);
      setCanInstall(false);
    }
  };

  return {
    canInstall,
    isInstalled,
    isOnline,
    install,
    installPrompt,
  };
}

// Utility functions for PWA features
export const pwaUtils = {
  // Check if app is installable
  isInstallable: () => {
    return 'beforeinstallprompt' in window;
  },

  // Check if app is already installed
  isInstalled: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  },

  // Check if running on mobile
  isMobile: () => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Get browser info
  getBrowserInfo: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('edg')) {
      return { name: 'edge', version: 'unknown' };
    } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      return { name: 'chrome', version: 'unknown' };
    } else if (userAgent.includes('firefox')) {
      return { name: 'firefox', version: 'unknown' };
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      return { name: 'safari', version: 'unknown' };
    }
    
    return { name: 'unknown', version: 'unknown' };
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  // Check notification permission
  hasNotificationPermission: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },

  // Show notification
  showNotification: (title: string, options?: NotificationOptions) => {
    if ('serviceWorker' in navigator && pwaUtils.hasNotificationPermission()) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  },
};