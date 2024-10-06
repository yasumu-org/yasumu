'use client';
import { useRequestStore } from '@/stores/api-testing/request-config.store';
import { YasumuRequestScript } from './yasumu-script';
import { useResponse } from '@/stores/api-testing/response.store';
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect } from 'react';

export function PostRequestScript() {
  const { current } = useRequestStore();
  const { script, setScript } = useResponse();

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
        current?.setPostResponseScript(script);
        setScript(script);
        save();
      }}
    />
  );
}
