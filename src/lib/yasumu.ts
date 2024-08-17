import { fetch } from '@tauri-apps/plugin-http';
import { Store } from '@tauri-apps/plugin-store';
import * as events from '@tauri-apps/api/event';
import * as path from '@tauri-apps/api/path';
import * as fs from '@tauri-apps/plugin-fs';
import * as dialog from '@tauri-apps/plugin-dialog';
import {
  createYasumu,
  FileSystemCommon,
  StoreCommon,
  PathCommon,
  EventsCommon,
  ScriptsCommon,
  FetchCommon,
} from '@yasumu/core';
import * as app from '@tauri-apps/api/app';
import { invoke, addPluginListener } from '@tauri-apps/api/core';
import * as shell from '@tauri-apps/plugin-shell';
import * as process from '@tauri-apps/plugin-process';

export const Yasumu = createYasumu({
  fetch: fetch as FetchCommon,
  fs: fs as unknown as FileSystemCommon,
  app: {
    getName: app.getName,
    getRuntimeVersion: app.getTauriVersion,
    getVersion: app.getVersion,
  },
  createStore(store: string) {
    return new Store(store) as unknown as StoreCommon;
  },
  dialog: dialog,
  path: path as unknown as PathCommon,
  events: events as EventsCommon,
  scripts: {
    async evaluate<T>(): Promise<T> {
      return null as unknown as T;
    },
  } satisfies ScriptsCommon,
  commands: {
    invoke,
    addPluginListener,
  },
  process,
  shell,
});
