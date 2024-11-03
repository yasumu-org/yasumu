import { persistentAtom } from '@nanostores/persistent';
import { YasumuLayout } from '@/lib/constants/layout';

export const $appLayout = persistentAtom<YasumuLayout>('app-layout', YasumuLayout.Default);

export function setAppLayout(layout: YasumuLayout) {
  $appLayout.set(layout);
}
