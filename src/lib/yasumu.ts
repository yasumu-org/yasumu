import { fetch } from '@tauri-apps/plugin-http';
import { Store } from '@tauri-apps/plugin-store';
import * as events from '@tauri-apps/api/event';
import * as path from '@tauri-apps/api/path';
import * as fs from '@tauri-apps/plugin-fs';
import * as dialog from '@tauri-apps/plugin-dialog';
import { createYasumu, FileSystemCommon, StoreCommon, PathCommon, EventsCommon, ScriptsCommon } from '@yasumu/core';
import * as app from '@tauri-apps/api/app';
import { invoke, addPluginListener } from '@tauri-apps/api/core';
import * as shell from '@tauri-apps/plugin-shell';
import * as process from '@tauri-apps/plugin-process';
import { evaluateUnsafe } from './script';

export const Yasumu = createYasumu({
  fetch,
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
    // TODO: use tanxium runtime to evaluate the script
    async evaluate<T>(script: string, contextData: string): Promise<T> {
      return evaluateUnsafe<T>(script, contextData);
    },
  } satisfies ScriptsCommon,
  commands: {
    invoke,
    addPluginListener,
  },
  process,
  shell,
});
