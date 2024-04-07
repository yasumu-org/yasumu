import { Store } from '@tauri-apps/plugin-store';
import { useState } from 'react';

export function useStorage(name = '.yasumustore.bin') {
  const store = useState(() => {
    const store = new Store(name);
    return store;
  })[0];

  return store;
}
