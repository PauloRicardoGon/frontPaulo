import { queueStore, type QueueRequest } from './idb';

const QUEUE_EVENT = 'queue-updated';

const notifyQueueChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(QUEUE_EVENT));
  }
};

export const enqueueRequest = async (request: QueueRequest) => {
  await queueStore.add(request);
  notifyQueueChange();
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((registration) => registration.sync.register('api-queue')).catch(() => undefined);
  }
};

export const dequeueRequest = async (id: string) => {
  await queueStore.delete(id);
  notifyQueueChange();
};

export const listQueuedRequests = async () => queueStore.getAll();

export const onQueueChange = (listener: () => void) => {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(QUEUE_EVENT, listener);
  return () => window.removeEventListener(QUEUE_EVENT, listener);
};

export const buildQueueRequest = (input: Omit<QueueRequest, 'id' | 'createdAt'>) => ({
  ...input,
  id: crypto.randomUUID(),
  createdAt: Date.now(),
});
