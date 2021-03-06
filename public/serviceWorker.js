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
//function '(e)' can be also written as evt or event all works the same
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

//we succefully install the service worker but now we must activate it
self.addEventListener('activate', function(e) {
e.waitUntil(
    cache.keys().then(keyList => {
        return Promise.all(
            keyList.map(key => {
                // !== doesn't do type conversion 
                //here we are removing the old cahce that is not useful
                if (key !== CACHE_NAME && key !== DATA_CACHE_NAME)  {
                    console.log('Old chache has been deleted');
                    return caches.delete(key);
                }
            })
        );
    })
);
self.clients.claim();
});

//any and all fetch requests we will intercept
self.addEventListener('fetch', function (e) {
if (e.request.url.includes('/api/')) {
    e.respondWith(
        caches.delete
        .open(DATA_CACHE_NAME)
        .then(cache => {
            return fetch(e.request)
            //good repsonse will clone it and store in the cache
            .then(response =>{
                if (response.status === 200) {
                    cache.put(e.request.url, response.clone());
                }
                return response;
            })
            //network failing try and get from stored cache
            .catch(err => {
                return cache.macth(e.request);
            });
        })
        .catch(err => console.log(err))
    );
    return;
}
e.respondWith(
    fetch(e.request).catch(function () {
        return caches.match(e.request).then(function (response) {
                if (response) {
                    return response;
                    //return the home-page cache for html page requests
                } else if (e.request.headers.get('accept').includes('text/html')){
                    return caches.match('/');
                }
        });
    })
);
});