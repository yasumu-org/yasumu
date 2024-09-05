'use client';
import { useRequestConfig } from '@/stores/api-testing/request-config.store';
import { YasumuRequestScript } from './yasumu-script';

export function PreRequestScript() {
  const { script, setScript } = useRequestConfig();

  return <YasumuRequestScript script={script} setScript={setScript} />;
}
