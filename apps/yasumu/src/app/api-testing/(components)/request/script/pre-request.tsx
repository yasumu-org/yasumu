'use client';
import { useRequestConfig, useRequestStore } from '@/stores/api-testing/request-config.store';
import { YasumuRequestScript } from './yasumu-script';
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect } from 'react';

export function PreRequestScript() {
  const { current } = useRequestStore();
  const { script, setScript } = useRequestConfig();

  const save = useDebounceCallback(() => {
    current?.save().catch(console.error);
  }, 2000);

  useEffect(() => {
    if (!current) return;
    return () => void current?.save().catch(console.error);
  }, [current]);

  return (
    <YasumuRequestScript
      script={script}
      setScript={(script) => {
        current?.setPreRequestScript(script);
        setScript(script);
        save();
      }}
    />
  );
}
