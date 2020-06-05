const CACHE_NAME = "v1";

const CACHE_ASSETS = ["index.html", "offline.html"];

// Call Install Event
self.addEventListener("install", (e) => {
  console.log("Installed: Service Worker.");
  /*
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service worker: caching files");
        cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
  */
});

// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("Activated: Service worker.");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      cacheNames.map((cache) => {
        if (cache != CACHE_NAME) {
          console.log("Serice woreker: Clearing old cache.");
          return caches.delete(cache);
        }
      });
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log("Service worker: Fetching... ");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
