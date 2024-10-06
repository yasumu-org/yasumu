'use client';
import { useRequestConfig, useRequestStore } from '@/stores/api-testing/request-config.store';
import { YasumuRequestScript } from './yasumu-script';
import { useEffect } from 'react';

export function PreRequestScript() {
  const { current } = useRequestStore();
  const { script, setScript } = useRequestConfig();

  useEffect(() => {
    if (!current) return;

    current.setPreRequestScript(script || '');
  }, [current, script]);

  return <YasumuRequestScript script={script} setScript={setScript} />;
}
