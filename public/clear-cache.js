// Clear Service Worker Cache - Run this in browser console
async function clearServiceWorkerCache() {
  try {
    // Unregister all service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service Worker unregistered');
    }

    // Clear all caches
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`Cache deleted: ${cacheName}`);
    }

    // Clear local storage
    localStorage.clear();
    console.log('Local storage cleared');

    // Clear session storage
    sessionStorage.clear();
    console.log('Session storage cleared');

    console.log('✅ All caches and service workers cleared! Please refresh the page.');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
}

// Auto-run if this script is loaded
if (typeof window !== 'undefined' && window.location) {
  clearServiceWorkerCache();
}