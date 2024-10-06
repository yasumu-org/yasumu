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
  }, [current, test]);

  return <YasumuRequestScript script={test} setScript={setTest} />;
}
