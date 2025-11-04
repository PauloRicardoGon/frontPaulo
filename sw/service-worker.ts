/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<unknown> };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
const QUEUE_DB = 'app-assistencia-tecnica';
const QUEUE_STORE = 'request-queue';

clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const openQueueDB = async () => {
  const dbOpen = indexedDB.open(QUEUE_DB, 1);
  return await new Promise<IDBDatabase>((resolve, reject) => {
    dbOpen.onerror = () => reject(dbOpen.error);
    dbOpen.onsuccess = () => resolve(dbOpen.result);
    dbOpen.onupgradeneeded = () => {
      const db = dbOpen.result;
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
      }
    };
  });
};

const readAllQueued = async () => {
  const db = await openQueueDB();
  return await new Promise<any[]>((resolve, reject) => {
    const transaction = db.transaction(QUEUE_STORE, 'readonly');
    const store = transaction.objectStore(QUEUE_STORE);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result ?? []);
  });
};

const putQueue = async (record: any) => {
  const db = await openQueueDB();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const req = store.put(record);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
};

const deleteFromQueue = async (id: string) => {
  const db = await openQueueDB();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(QUEUE_STORE, 'readwrite');
    const store = transaction.objectStore(QUEUE_STORE);
    const req = store.delete(id);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
};

registerRoute(
  ({ request }) => ['style', 'script', 'font', 'image'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  }),
);

registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 5,
    plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 })],
  }),
);

const staleWhileRevalidate = new StaleWhileRevalidate({
  cacheName: 'api-cache',
  plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 10 })],
});

registerRoute(
  ({ request, url }) => {
    if (request.method !== 'GET') return false;
    if (!url.href.startsWith(API_BASE_URL)) return false;
    if (url.pathname.startsWith('/users/')) return false;
    return ['/clientes', '/equipamentos'].some((path) => url.pathname.startsWith(path));
  },
  staleWhileRevalidate,
);

setCatchHandler(async ({ request }) => {
  if (request.destination === 'document') {
    const cache = await caches.open('pages-cache');
    const offline = await cache.match('/offline');
    if (offline) {
      return offline;
    }
  }
  return Response.error();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method === 'GET') {
    return;
  }

  if (!request.url.startsWith(API_BASE_URL)) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request.clone());
        const cloned = response.clone();
        const contentType = cloned.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await cloned.json();
          if ('token' in data || 'refreshToken' in data) {
            return response;
          }
        }
        return response;
      } catch (error) {
        const headersObj: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headersObj[key] = value;
        });
        let body: any = null;
        try {
          body = await request.clone().json();
        } catch (jsonError) {
          body = null;
        }

        const record = {
          id: crypto.randomUUID(),
          url: request.url,
          method: request.method,
          body,
          headers: headersObj,
          createdAt: Date.now(),
        };
        await putQueue(record);
        if ('sync' in self.registration) {
          try {
            await self.registration.sync.register('api-queue');
          } catch (syncError) {
            // ignore
          }
        }
        return new Response(JSON.stringify({ queued: true }), {
          status: 202,
          headers: { 'content-type': 'application/json' },
        });
      }
    })(),
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'api-queue') {
    event.waitUntil(
      (async () => {
        const records = await readAllQueued();
        for (const record of records) {
          try {
            const headers = new Headers(record.headers ?? {});
            await fetch(record.url, {
              method: record.method,
              headers,
              body: record.body ? JSON.stringify(record.body) : undefined,
            });
            await deleteFromQueue(record.id);
          } catch (error) {
            console.error('Falha ao reenviar requisição da fila', error);
          }
        }
        const swClients = await self.clients.matchAll({ includeUncontrolled: true });
        swClients.forEach((client) => client.postMessage({ type: 'QUEUE_UPDATED' }));
      })(),
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
