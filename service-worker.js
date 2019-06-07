const cacheName = "grindcore_cache";

const filesToCache = [
    "/grindcore.io/css/kap_style.css",
    "/grindcore.io/css/normalize.css",
    "/grindcore.io/js/vendor/jquery-3.3.1.min.js",
    "/grindcore.io/js/vendor/modernizr-3.7.1.min.js",
    "/grindcore.io/js/main.js",
    "/grindcore.io/js/plugins.js",
    "/grindcore.io/js/albums.js",
    "/grindcore.io/js/artists.js",
    "/grindcore.io/js/search_artists.js",
    "/grindcore.io/img/grind_logo.png",
    "/grindcore.io/img/grind_mini.png",
    "/grindcore.io/img/loading.gif",
    "/grindcore.io/img/np_scum.png",
    "/grindcore.io/img/offline.png",
    "/grindcore.io/img/search_complete.png",
    "/grindcore.io/img/nothing_found.png",
    "/grindcore.io/img/icons/icon_16.png",
    "/grindcore.io/img/icons/icon_24.png",
    "/grindcore.io/img/icons/icon_32.png",
    "/grindcore.io/img/icons/icon_48.png",
    "/grindcore.io/img/icons/icon_64.png",
    "/grindcore.io/img/icons/icon_96.png",
    "/grindcore.io/img/icons/icon_128.png",
    "/grindcore.io/img/icons/icon_192.png",
    "/grindcore.io/img/icons/icon_256.png",
    "/grindcore.io/manifest.json",
    "/grindcore.io/service-worker.js"
];

const pagesToCache = [
    "/grindcore.io/index.html",
    "/grindcore.io/top_artists.html",
    "/grindcore.io/top_albums.html",
    "/grindcore.io/artist_search.html"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => {
        fetch("/grindcore.io/manifest.json").then((response) => {
            response.json()
        })
        .then((assets) => {
            cache.addAll(filesToCache);
            cache.addAll(pagesToCache);
        });
    }));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        return response || fetch(event.request);
    }));
});

self.addEventListener("activate", event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (!cacheWhitelist.includes(key)) {
                return caches.delete(key);
            }
        }))
    }));
});