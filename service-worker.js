const cacheName = "devops-flashcards-cache-v1";
const staticAssets = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./questions.json",
    "./manifest.json",
    "./assets/icons/favicon-16x16.png",
    "./assets/icons/favicon-32x32.png"
];

self.addEventListener("install", async (event) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    event.respondWith(networkFirst(req));
});

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        return cache.match(req);
    }
}

// Add notification scheduling logic to service worker
self.addEventListener('periodicsync', (event) => {
    console.log('Periodic sync event:', event);
    if (event.tag === 'daily-notification') {
        const now = new Date();
        self.registration.showNotification('DevOps Flashcards', {
            body: 'Time to practice your DevOps knowledge!',
            icon: '/assets/icons/favicon-32x32.png'
        });
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
