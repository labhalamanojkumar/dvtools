const CACHE_NAME = 'dvtools-v2.0.2'; // Updated to force cache refresh after hydration fix
const STATIC_CACHE = 'dvtools-static-v2';
const DYNAMIC_CACHE = 'dvtools-dynamic-v2';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/tools',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  // Add critical resources that should always be available offline
];

// Files that should be cached on-demand
const CACHE_STRATEGIES = {
  // Cache-first for static assets
  'static': {
    match: (url) => {
      return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/);
    },
    strategy: 'cache-first'
  },
  // Network-first for API calls
  'api': {
    match: (url) => {
      return url.pathname.startsWith('/api/');
    },
    strategy: 'network-first'
  },
  // Stale-while-revalidate for pages
  'pages': {
    match: (url) => {
      return url.pathname.match(/^(\/tools\/|\/blog\/|\/install\/)/);
    },
    strategy: 'stale-while-revalidate'
  }
};

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle different cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

// Handle fetch requests with appropriate caching strategy
async function handleFetch(request) {
  const url = new URL(request.url);
  const cacheType = getCacheType(url);
  
  switch (cacheType) {
    case 'static':
      return cacheFirst(request, STATIC_CACHE);
    case 'api':
      return networkFirst(request, DYNAMIC_CACHE);
    case 'pages':
      return staleWhileRevalidate(request, DYNAMIC_CACHE);
    default:
      return networkFirst(request, DYNAMIC_CACHE);
  }
}

// Determine cache type based on URL
function getCacheType(url) {
  for (const [type, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.match(url)) {
      return type;
    }
  }
  return 'default';
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache-first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('Network failed in stale-while-revalidate:', error);
  });
  
  return cachedResponse || fetchPromise || new Response('Offline', { status: 503 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      handleBackgroundSync()
    );
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Get any pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful action from pending
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
        // Keep action in queue for next sync
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'dvtools-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: data.url || '/'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'DvTools', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window if app is not open
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Periodic background sync (experimental)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      updateContent()
    );
  }
});

// Update content in background
async function updateContent() {
  try {
    // Update cached content in background
    const cache = await caches.open(STATIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.put(request, response.clone());
        }
      } catch (error) {
        console.log('Background update failed for:', request.url);
      }
    }
  } catch (error) {
    console.error('Background content update failed:', error);
  }
}

// Utility functions for pending actions
async function getPendingActions() {
  // Implementation would use IndexedDB to store pending actions
  return [];
}

async function removePendingAction(actionId) {
  // Implementation would remove action from IndexedDB
  return Promise.resolve();
}

// Handle app install prompt
self.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  
  // Store the event for later use
  self.deferredPrompt = event;
  
  // Notify the main app that install prompt is available
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'INSTALL_PROMPT_AVAILABLE'
      });
    });
  });
});

// Handle app installation
self.addEventListener('appinstalled', (event) => {
  console.log('App was installed');
  
  // Notify the main app
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'APP_INSTALLED'
      });
    });
  });
});

// Message handling from main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_TOOLS':
      cacheTools(data.tools);
      break;
    case 'GET_CACHE_STATUS':
      getCacheStatus().then((status) => {
        event.ports[0].postMessage({ type: 'CACHE_STATUS', data: status });
      });
      break;
  }
});

// Cache specific tools for offline use
async function cacheTools(tools) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const tool of tools) {
    try {
      const response = await fetch(tool.url);
      if (response.ok) {
        await cache.put(tool.url, response.clone());
      }
    } catch (error) {
      console.error(`Failed to cache tool: ${tool.url}`, error);
    }
  }
}

// Get cache status
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {
    caches: cacheNames.length,
    total: 0,
    items: []
  };
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    status.items.push({
      name: cacheName,
      count: keys.length
    });
    status.total += keys.length;
  }
  
  return status;
}