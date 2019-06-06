const cacheName = "grindcore_cache";

const filesToCache = [
    "css/kap_style.css",
    "css/normalize.css",
    "js/vendor/jquery-3.3.1.min.js",
    "js/vendor/modernizr-3.7.1.min.js",
    "js/main.js",
    "js/plugins.js",
    "js/albums.js",
    "js/artists.js",
    "js/search_artists.js",
    "img/grind_logo.png",
    "img/grind_mini.png",
    "img/loading.gif",
    "img/np_scum.png",
    "img/icons/icon_16.png",
    "img/icons/icon_24.png",
    "img/icons/icon_32.png",
    "img/icons/icon_48.png",
    "img/icons/icon_64.png",
    "img/icons/icon_96.png",
    "img/icons/icon_128.png",
    "img/icons/icon_192.png",
    "img/icons/icon_256.png",
    "service-worker.js",
    "manifest.json"
];

const pagesToCache = [
    "index.html",
    "top_artists.html",
    "top_albums.html",
    "artist_search.html"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => {
        fetch("manifest.json").then((response) => {
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