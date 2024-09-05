'use client';
import { YasumuRequestScript } from './yasumu-script';
import { useResponse } from '@/stores/api-testing/response.store';

export function PostRequestScript() {
  const { script, setScript } = useResponse();

  return <YasumuRequestScript script={script} setScript={setScript} />;
}
