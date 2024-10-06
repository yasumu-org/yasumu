'use client';
import { YasumuRequestScript } from './yasumu-script';
import { useResponse } from '@/stores/api-testing/response.store';
import { useRequestStore } from '@/stores/api-testing/request-config.store';
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect } from 'react';

export function TestScript() {
  const { current } = useRequestStore();
  const { test, setTest } = useResponse();

  const save = useDebounceCallback(() => {
    current?.save().catch(console.error);
  }, 2000);

  useEffect(() => {
    if (!current) return;
    return () => void current?.save().catch(console.error);
  }, [current]);

  return (
    <YasumuRequestScript
      script={test}
      setScript={(test) => {
        current?.setTestScript(test);
        setTest(test);
        save();
      }}
    />
  );
}
