'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "b1eb6dc79c9bcfb75e43da3653f2ee6a",
"/": "b1eb6dc79c9bcfb75e43da3653f2ee6a",
"main.dart.js": "4f3dbaf5680e7c9b26c9caea34ef1904",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "1094fc05d9c9a690a65270f92a698342",
"assets/images/yt_logo_rgb_dark.png": "2041e4dc148e8f833f13497fe4d43214",
"assets/images/instagram.jpg": "6136279ff672eb97dbb2503acfc3685c",
"assets/images/livro.png": "37cea20f55d852ebdbace07fcdffc2b8",
"assets/images/digital.png": "4b14b61e457037d27ec29d255634329b",
"assets/images/Screen%2520Shot%25202019-11-11%2520at%252019.12.50.png": "22faa2e6ba23f427971fd4c8ac27cf49",
"assets/images/Screen%2520Shot%25202019-09-27%2520at%252019.40.59.png": "a8177940b961eb70883320800121d65b",
"assets/images/insta4.png": "a472723e9482a6e85c0a49dc2c5265af",
"assets/images/Mockups/livro.png": "c6decd15a8411b6f9c4e159bf72ec7c4",
"assets/images/Mockups/capa_low.jpg": "f295e5b08c05665faa6cd6f1141d1699",
"assets/images/Mockups/alemdomar1%2520copy.png": "326471b9a146cefe52f8cf1d2531b05d",
"assets/images/Mockups/Aberto_singapura.jpg": "253f2442dbef316f6be19d458bdcd4af",
"assets/images/Mockups/Aberto_New%2520Zealand.jpg": "140a28db85a11987a225585c8a06d225",
"assets/images/Mockups/alemdomar1.png": "11dc609076cf3e60b0ea775c4014381f",
"assets/images/Mockups/Aberto_seoul.jpg": "598c7c29941d2d28c00e932e046bc6e9",
"assets/images/Mockups/alem.jpg": "049a199a419f5e24681643520726a3ef",
"assets/images/Mockups/Capa%2520copy.jpg": "c03d2c582058628e3394355c3fce6221",
"assets/images/Mockups/Aberto_bayofislands.jpg": "cf7b6db8e68d160a20b44e5ba28fc565",
"assets/images/Mockups/Capa.jpg": "d474e24b07da263e65672af0ef1152e9",
"assets/images/insta3.png": "d16d1ab4476e80641b844bcd02c49c21",
"assets/images/insta.png": "729f7798561be2cb67f39e916a22eb6a",
"assets/images/fav.png": "e3a1f27b45c0a76634e18d40ca5dd36c",
"assets/images/livros.jpg": "dd33526e11162f2ad7ff46829ec42c61",
"assets/images/livro2.jpg": "06e7a9afdc2a0fe180cd80756707de02",
"assets/images/livros%2520copy.jpg": "8d3c9a66cc685c2488d7961041b5aa26",
"assets/AssetManifest.json": "3e965a4689e346712ded0314b97932f0",
"assets/NOTICES": "108d0a1640e6b622b04c79e5a1de9f51",
"assets/FontManifest.json": "cea94a5d24362297d2164fa77e55e73d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/assets/fonts/Bariol_Regular.otf": "ffe84263f982cbe9bae053b0cbb6dcda",
"assets/assets/fonts/Bariol_Light.otf": "bc003c9f8669b675919825cf8cba41d5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/LICENSE",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a no-cache param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'no-cache'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'no-cache'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.message == 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message = 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.add(resourceKey);
    }
  }
  return Cache.addAll(resources);
}
