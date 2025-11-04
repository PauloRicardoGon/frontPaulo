import { openDB } from 'idb';

export interface QueueRequest {
  id: string;
  url: string;
  method: string;
  body?: Record<string, unknown> | FormData | null;
  headers?: Record<string, string>;
  createdAt: number;
}

const DB_NAME = 'app-assistencia-tecnica';
const STORE_NAME = 'request-queue';

export const getQueueDB = async () =>
  openDB(DB_NAME, 1, {
    upgrade: (db) => {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });

export const queueStore = {
  async add(request: QueueRequest) {
    const db = await getQueueDB();
    await db.put(STORE_NAME, request);
  },
  async delete(id: string) {
    const db = await getQueueDB();
    await db.delete(STORE_NAME, id);
  },
  async getAll() {
    const db = await getQueueDB();
    return db.getAll(STORE_NAME) as Promise<QueueRequest[]>;
  },
  async clear() {
    const db = await getQueueDB();
    await db.clear(STORE_NAME);
  },
};

export { STORE_NAME as QUEUE_STORE_NAME };
