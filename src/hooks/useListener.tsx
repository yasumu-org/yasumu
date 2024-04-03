import { EventName, EventCallback, listen } from '@tauri-apps/api/event';
import { useEffect } from 'react';

export function useListener<P>(event: EventName, handler: EventCallback<P>) {
  useEffect(() => {
    const cleanup = listen(event, handler);
    return () => void cleanup.then((c) => c());
  }, []);
}
