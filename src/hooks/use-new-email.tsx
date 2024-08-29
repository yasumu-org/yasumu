'use client';

import { Yasumu } from '@/lib/yasumu';
import { Event } from '@tauri-apps/api/event';
import { YasumuEvents, YasumuMail } from '@yasumu/core';
import { useEffect } from 'react';

export function useNewEmail(handler: (email: YasumuMail) => void) {
  useEffect(() => {
    const unsubscribe = Yasumu.events.listen(YasumuEvents.NewEmail, (event: Event<YasumuMail>) =>
      handler(event.payload),
    );

    return () => void unsubscribe.then((fn) => fn());
  }, [handler]);
}
