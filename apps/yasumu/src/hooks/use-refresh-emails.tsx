'use client';

import { Yasumu } from '@/lib/yasumu';
import { YasumuEvents } from '@yasumu/core';
import { useEffect } from 'react';

export function useRefreshEmails(handler: () => Awaited<void>) {
  useEffect(() => {
    const unsubscribe = Yasumu.events.listen(YasumuEvents.RefreshAll, () => handler());

    return () => void unsubscribe.then((fn) => fn());
  }, [handler]);
}
