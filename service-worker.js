const CACHE_NAME = "notes-app-v2";

const FILES_TO_CACHE = [
"./",
"./index.html",
"./style.css",
"./app.js",
"./manifest.json",
"./icon.png"
];

/* =========================
INSTALL
========================= */

self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME)
.then((cache) => {
return cache.addAll(FILES_TO_CACHE);
})
.then(() => {
return self.skipWaiting();
})
);
});

/* =========================
ACTIVATE
========================= */

self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys()
.then((cacheNames) => {
return Promise.all(
cacheNames
.filter((cacheName) => {
return cacheName !== CACHE_NAME;
})
.map((cacheName) => {
return caches.delete(cacheName);
})
);
})
.then(() => {
return self.clients.claim();
})
);
});

/* =========================
FETCH
========================= */

self.addEventListener("fetch", (event) => {
event.respondWith(
caches.match(event.request)
.then((cachedResponse) => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request);
        })
        .catch(() => {
            return caches.match("./index.html");
        })
);


});
