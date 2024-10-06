'use client';
import { useEffect } from 'react';
import { YasumuRequestScript } from './yasumu-script';
import { useResponse } from '@/stores/api-testing/response.store';
import { useRequestStore } from '@/stores/api-testing/request-config.store';

export function TestScript() {
  const { current } = useRequestStore();
  const { test, setTest } = useResponse();

  useEffect(() => {
    if (!current) return;

    current.setTestScript(test || '');

    const timer = setTimeout(() => {
      current?.save().catch(console.error);
    }, 1000);

    return () => clearTimeout(timer);
  }, [current, test]);

  return <YasumuRequestScript script={test} setScript={setTest} />;
}
