// Hydration Error Fix - Clear Browser Cache and Service Worker
// Run this in browser console to fix hydration errors

async function fixHydrationError() {
  console.log('🔧 Fixing hydration error...');

  try {
    // 1. Clear service workers
    console.log('1. Clearing service workers...');
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('✅ Service worker unregistered');
    }

    // 2. Clear all caches
    console.log('2. Clearing caches...');
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`✅ Cache deleted: ${cacheName}`);
    }

    // 3. Clear local storage
    console.log('3. Clearing local storage...');
    localStorage.clear();
    console.log('✅ Local storage cleared');

    // 4. Clear session storage
    console.log('4. Clearing session storage...');
    sessionStorage.clear();
    console.log('✅ Session storage cleared');

    console.log('🎉 Hydration error fix complete!');
    console.log('📋 Next steps:');
    console.log('   1. Refresh the page (Ctrl+F5 or Cmd+Shift+R)');
    console.log('   2. Check browser console for errors');
    console.log('   3. If error persists, try incognito mode');

  } catch (error) {
    console.error('❌ Error fixing hydration:', error);
  }
}

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined' && window.location) {
  fixHydrationError();
}