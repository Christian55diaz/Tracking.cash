const { response } = require("express");

// we need to acquire cahce
const CACHE_NAME = 'my-site-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/js/idb.js",
    "/js/index.js",
    "/manifest.json",
    "/css/styles.css",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png"
];

//we also need to install the service worker so it actually works
self.addEventListener('install', function (e) {
e.waitUntil(
    cahces.open(CACHE_NAME).then(cahce => {
        //console logging so that we know the test ran correct if we got this message
        console.log('Files have been CACHED!');
        //return all the files cache to "FILES_TO_CACHE"
        return Cache.addAll(FILES_TO_CACHE);
    })
);
self.skipWaiting();
});

