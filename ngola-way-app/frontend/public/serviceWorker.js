const CACHE_NAME = 'ngola-way-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/styles.css',
  '/assets/main.js',
];

// Dynamic assets to cache
const DYNAMIC_CACHE_PATTERNS = [
  /\.(?:js|css|woff2)$/,  // Static assets
  /^https:\/\/api\.mapbox\.com/,  // Mapbox assets
  /^https:\/\/fonts\.googleapis\.com/,  // Google Fonts
  /^https:\/\/fonts\.gstatic\.com/,  // Google Fonts assets
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to check if URL matches dynamic cache patterns
const shouldCacheDynamically = (url) => {
  return DYNAMIC_CACHE_PATTERNS.some(pattern => pattern.test(url));
};

// Fetch event - serve from cache, then network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests that aren't configured to be cached
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !shouldCacheDynamically(event.request.url)) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          // Fetch new version in background
          event.waitUntil(
            fetch(event.request)
              .then(response => {
                if (response.ok) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, response));
                }
              })
          );
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we should cache this response
            if (!response.ok) return response;
            
            // Cache the response for future use
            if (shouldCacheDynamically(event.request.url)) {
              const clonedResponse = response.clone();
              event.waitUntil(
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, clonedResponse))
              );
            }

            return response;
          })
          .catch(() => {
            // If offline and resource isn't cached, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return null;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-rides') {
    event.waitUntil(syncRides());
  } else if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Helper function to sync rides
async function syncRides() {
  const db = await openDB();
  const pendingRides = await db.getAll('pendingRides');
  
  for (const ride of pendingRides) {
    try {
      await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ride)
      });
      await db.delete('pendingRides', ride.id);
    } catch (error) {
      console.error('Failed to sync ride:', error);
    }
  }
}

// Helper function to sync bookings
async function syncBookings() {
  const db = await openDB();
  const pendingBookings = await db.getAll('pendingBookings');
  
  for (const booking of pendingBookings) {
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      await db.delete('pendingBookings', booking.id);
    } catch (error) {
      console.error('Failed to sync booking:', error);
    }
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NgolaWayDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingRides')) {
        db.createObjectStore('pendingRides', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pendingBookings')) {
        db.createObjectStore('pendingBookings', { keyPath: 'id' });
      }
    };
  });
}
