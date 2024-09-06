'use client';
import { YasumuRequestScript } from './yasumu-script';
import { useResponse } from '@/stores/api-testing/response.store';

export function TestScript() {
  const { test, setTest } = useResponse();

  return <YasumuRequestScript script={test} setScript={setTest} />;
}
