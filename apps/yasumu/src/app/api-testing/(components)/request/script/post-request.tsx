'use client';
import { useRequestStore } from '@/stores/api-testing/request-config.store';
import { YasumuRequestScript } from './yasumu-script';
import { useResponse } from '@/stores/api-testing/response.store';
import { useEffect } from 'react';

export function PostRequestScript() {
  const { current } = useRequestStore();
  const { script, setScript } = useResponse();

  useEffect(() => {
    if (!current) return;

    current.setPostResponseScript(script || '');

    const timer = setTimeout(() => {
      current?.save().catch(console.error);
    }, 1000);

    return () => clearTimeout(timer);
  }, [current, script]);

  return <YasumuRequestScript script={script} setScript={setScript} />;
}
