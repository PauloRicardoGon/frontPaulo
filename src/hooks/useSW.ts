'use client';

import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

export const useSW = () => {
  const [wb, setWb] = useState<Workbox | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/sw.js').then((registration) => {
        if (registration) {
          setWb(null);
          return;
        }
        const workbox = new Workbox('/sw.js');
        workbox.register();
        setWb(workbox);
      });
    }
  }, []);

  return wb;
};
