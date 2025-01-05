const cacheName = "devops-flashcards-cache-v1";
const staticAssets = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./questions.json",
    "./manifest.json",
    "./assets/icons/icon-192x192.png",
    "./assets/icons/icon-512x512.png"
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
