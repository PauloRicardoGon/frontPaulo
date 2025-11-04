'use client';

import { useEffect, useState } from 'react';
import { listQueuedRequests, onQueueChange } from '@/lib/queue';

export const useQueue = () => {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      const items = await listQueuedRequests();
      if (mounted) {
        setPending(items.length);
      }
    };

    refresh();
    const unsubscribe = onQueueChange(refresh);
    const messageHandler = (event: MessageEvent) => {
      if (event.data?.type === 'QUEUE_UPDATED') {
        refresh();
      }
    };
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', messageHandler);
    }

    return () => {
      mounted = false;
      unsubscribe();
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      }
    };
  }, []);

  return { pending };
};
