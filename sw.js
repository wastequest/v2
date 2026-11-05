/* WasteQuest service worker: keeps the app usable on patchy school Wi-Fi.
   - On install it caches the page, the stylesheets and every script that index.html loads, plus the small images.
   - Page, CSS and JS: network first (so updates show up straight away), cached copy when the network fails or is slow.
   - Images: cached copy first, refreshed in the background.
   - Videos, PDFs and other sites (fonts, analytics, PeerJS, Google) are never cached here: they go straight to the network.
   Bump VERSION only to force-drop old caches; normal updates need no change here. */
const VERSION = "wq-v2-1", CACHE = VERSION, TIMEOUT = 4000;
const SHELL = ["./", "index.html", "manifest.webmanifest", "assets/logos-upm.jpeg", "assets/icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    let urls = SHELL;
    try {
      const html = await (await fetch("index.html", { cache: "no-cache" })).text();
      urls = [...new Set([...SHELL, ...[...html.matchAll(/(?:src|href)="((?:js|css|assets)\/[^"]+)"/g)].map(m => m[1])])];
    } catch (er) {}
    await Promise.all(urls.map(u => c.add(new Request(u, { cache: "no-cache" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("wq-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

const put = async (req, res) => { if (res && res.ok && res.type === "basic") { const c = await caches.open(CACHE); await c.put(req, res.clone()); } return res; };

async function networkFirst(req) {
  const net = fetch(req).then(r => put(req, r));
  net.catch(() => {});
  const timer = new Promise(ok => setTimeout(ok, TIMEOUT));
  try {
    const r = await Promise.race([net, timer]);
    if (r) return r;
  } catch (er) {}
  const hit = await caches.match(req, { ignoreSearch: req.mode === "navigate" }) || (req.mode === "navigate" && await caches.match("index.html"));
  return hit || net;
}

async function cacheFirst(req, ev) {
  const hit = await caches.match(req);
  const net = fetch(req).then(r => put(req, r));
  if (hit) { ev.waitUntil(net.catch(() => {})); return hit; }
  return net;
}

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || req.headers.has("range")) return;
  if (/\.(mp4|webm|pdf|zip)$/i.test(url.pathname) || url.pathname.endsWith("/sw.js")) return;
  if (req.mode === "navigate" || /\.(html|js|css|webmanifest)$/i.test(url.pathname)) e.respondWith(networkFirst(req));
  else if (/\.(png|jpe?g|gif|svg|webp)$/i.test(url.pathname)) e.respondWith(cacheFirst(req, e));
});
