'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2eff1abf48ac2bc294b9c8512a3fbf33",
"assets/assets/fonts/Bariol_Light.otf": "bc003c9f8669b675919825cf8cba41d5",
"assets/assets/fonts/Bariol_Regular.otf": "ffe84263f982cbe9bae053b0cbb6dcda",
"assets/FontManifest.json": "beff6d8d28323d28ac9adcb4f417670a",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"assets/images/digital.png": "4b14b61e457037d27ec29d255634329b",
"assets/images/fav.png": "e3a1f27b45c0a76634e18d40ca5dd36c",
"assets/images/insta.png": "729f7798561be2cb67f39e916a22eb6a",
"assets/images/insta3.png": "d16d1ab4476e80641b844bcd02c49c21",
"assets/images/insta4.png": "a472723e9482a6e85c0a49dc2c5265af",
"assets/images/instagram.jpg": "6136279ff672eb97dbb2503acfc3685c",
"assets/images/livro.png": "37cea20f55d852ebdbace07fcdffc2b8",
"assets/images/livro2.jpg": "f6c27edac5d3a0d8c1d4077223390094",
"assets/images/livro2Dig.jpg": "eb257b25a435c74f60b93bf8dc7f6ad7",
"assets/images/livros%2520copy.jpg": "8d3c9a66cc685c2488d7961041b5aa26",
"assets/images/livros.jpg": "dd33526e11162f2ad7ff46829ec42c61",
"assets/images/Mockups/Aberto_bayofislands.jpg": "cf7b6db8e68d160a20b44e5ba28fc565",
"assets/images/Mockups/Aberto_New%2520Zealand.jpg": "140a28db85a11987a225585c8a06d225",
"assets/images/Mockups/Aberto_seoul.jpg": "598c7c29941d2d28c00e932e046bc6e9",
"assets/images/Mockups/Aberto_singapura.jpg": "253f2442dbef316f6be19d458bdcd4af",
"assets/images/Mockups/alem.jpg": "049a199a419f5e24681643520726a3ef",
"assets/images/Mockups/alemdomar1%2520copy.png": "326471b9a146cefe52f8cf1d2531b05d",
"assets/images/Mockups/alemdomar1.png": "11dc609076cf3e60b0ea775c4014381f",
"assets/images/Mockups/Capa%2520copy.jpg": "c03d2c582058628e3394355c3fce6221",
"assets/images/Mockups/Capa.jpg": "d474e24b07da263e65672af0ef1152e9",
"assets/images/Mockups/capa_low.jpg": "f295e5b08c05665faa6cd6f1141d1699",
"assets/images/Mockups/livro.png": "c6decd15a8411b6f9c4e159bf72ec7c4",
"assets/images/Screen%2520Shot%25202019-09-27%2520at%252019.40.59.png": "a8177940b961eb70883320800121d65b",
"assets/images/Screen%2520Shot%25202019-11-11%2520at%252019.12.50.png": "22faa2e6ba23f427971fd4c8ac27cf49",
"assets/images/yt_logo_rgb_dark.png": "2041e4dc148e8f833f13497fe4d43214",
"assets/NOTICES": "0002a6b353015c5dc70581062fb0cfc1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.ico": "e3a1f27b45c0a76634e18d40ca5dd36c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "8fdbcef62e649a06640fc12783be00c8",
"/": "8fdbcef62e649a06640fc12783be00c8",
"main.dart.js": "035c5fca34c15ec08ed69f8aa045e4b1",
"manifest.json": "1094fc05d9c9a690a65270f92a698342",
"version.json": "743dae2372336ef34dd6b52b8bec85a9"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
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
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
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
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
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
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
