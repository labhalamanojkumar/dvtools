import { useState, useEffect } from 'react';

// Device types and browser detection
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'samsung' | 'brave' | 'unknown';
  supportsPWA: boolean;
  canInstall: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    os: 'unknown',
    browser: 'unknown',
    supportsPWA: false,
    canInstall: false,
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    isDesktop: true,
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    // Detect device type
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|windows ce|netfront|opera mobi|up.browser|up.link|dreamstone|semobile/i.test(userAgent);
    
    // Detect OS
    let os: DeviceInfo['os'] = 'unknown';
    if (/iphone|ipad|ipod/.test(userAgent)) {
      os = 'ios';
    } else if (/android/.test(userAgent)) {
      os = 'android';
    } else if (/windows/.test(userAgent)) {
      os = 'windows';
    } else if (/macintosh|mac os x/.test(userAgent)) {
      os = 'macos';
    } else if (/linux/.test(userAgent)) {
      os = 'linux';
    }

    // Detect browser
    let browser: DeviceInfo['browser'] = 'unknown';
    if (userAgent.includes('edg')) {
      browser = 'edge';
    } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      browser = 'chrome';
    } else if (userAgent.includes('firefox')) {
      browser = 'firefox';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browser = 'safari';
    } else if (userAgent.includes('samsungbrowser')) {
      browser = 'samsung';
    } else if (userAgent.includes('brave')) {
      browser = 'brave';
    }

    // Check PWA support
    const supportsPWA = 'serviceWorker' in navigator && 
                        'PushManager' in window && 
                        'beforeinstallprompt' in window;

    // Check if already installed (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true ||
                        document.referrer.includes('android-app://');

    // Check if can install
    const canInstall = supportsPWA && !isStandalone;

    setDeviceInfo({
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      os,
      browser,
      supportsPWA,
      canInstall,
      isStandalone,
      isIOS: os === 'ios',
      isAndroid: os === 'android',
      isDesktop: !isMobile && !isTablet,
      isMobile,
      isTablet,
    });
  }, []);

  return deviceInfo;
}

export function getInstallInstructions(deviceInfo: DeviceInfo): {
  title: string;
  steps: string[];
  browserSpecific?: { [key: string]: string };
} {
  if (deviceInfo.isStandalone) {
    return {
      title: 'App Already Installed',
      steps: ['The app is already installed and running in standalone mode!'],
    };
  }

  if (deviceInfo.isIOS) {
    return {
      title: 'Install on iPhone/iPad',
      steps: [
        '1. Tap the Share button (square with arrow up)',
        '2. Scroll down and tap "Add to Home Screen"',
        '3. Tap "Add" to confirm',
        '4. Find the DvTools icon on your home screen',
      ],
    };
  }

  if (deviceInfo.isAndroid) {
    const chromeSteps = [
      '1. Tap the menu (⋮) in Chrome',
      '2. Tap "Add to Home screen"',
      '3. Tap "Add" to confirm',
    ];

    const samsungSteps = [
      '1. Tap the menu (≡) in Samsung Internet',
      '2. Tap "Add page to" → "Home screen"',
      '3. Tap "Add" to confirm',
    ];

    return {
      title: 'Install on Android',
      steps: ['Look for the install prompt or use your browser\'s menu'],
      browserSpecific: {
        chrome: chromeSteps.join('\n'),
        samsung: samsungSteps.join('\n'),
      },
    };
  }

  if (deviceInfo.isDesktop) {
    if (deviceInfo.browser === 'chrome' || deviceInfo.browser === 'edge') {
      return {
        title: 'Install on Desktop',
        steps: [
          '1. Click the install icon in the address bar',
          '2. Or click the install button in the browser menu',
          '3. Click "Install" in the popup',
          '4. The app will be installed to your desktop/taskbar',
        ],
      };
    }

    return {
      title: 'Install on Desktop',
      steps: [
        '1. Look for the install option in your browser menu',
        '2. Look for the install icon in the address bar',
        '3. Click "Install" when prompted',
        '4. Follow your browser\'s installation process',
      ],
    };
  }

  return {
    title: 'Install App',
    steps: [
      '1. Open the browser menu',
      '2. Look for "Add to Home Screen" or "Install App"',
      '3. Follow your browser\'s installation steps',
    ],
  };
}

export function getRecommendedBrowser(deviceInfo: DeviceInfo): {
  name: string;
  url: string;
  reasons: string[];
} | null {
  if (deviceInfo.isIOS) {
    return {
      name: 'Chrome for iOS',
      url: 'https://apps.apple.com/app/chrome/id535886823',
      reasons: ['Better PWA support', 'Faster performance', 'More features'],
    };
  }

  if (deviceInfo.isAndroid) {
    return {
      name: 'Chrome for Android',
      url: 'https://play.google.com/store/apps/details?id=com.android.chrome',
      reasons: ['Full PWA support', 'Best install experience', 'Regular updates'],
    };
  }

  if (deviceInfo.isDesktop) {
    if (deviceInfo.browser === 'firefox' || deviceInfo.browser === 'safari') {
      return {
        name: 'Chrome for Desktop',
        url: 'https://www.google.com/chrome/',
        reasons: ['Superior PWA support', 'Better performance', 'More extensions'],
      };
    }
  }

  return null;
}