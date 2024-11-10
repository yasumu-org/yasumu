/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdapterType,
  DialogCommon,
  EventsCommon,
  FileSystemCommon,
  PathCommon,
  StoreCommon,
  WebSocketCommon,
  YasumuBootstrapOptions,
} from '@yasumu/core';
import * as fs from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';
import * as app from '@tauri-apps/api/app';
import * as events from '@tauri-apps/api/event';
import * as shell from '@tauri-apps/plugin-shell';
import * as process from '@tauri-apps/plugin-process';
import * as dialog from '@tauri-apps/plugin-dialog';
import * as http from '@tauri-apps/plugin-http';
import * as store from '@tauri-apps/plugin-store';
import ws from '@tauri-apps/plugin-websocket';
import { invoke, addPluginListener } from '@tauri-apps/api/core';

export function NativeAdapter(): YasumuBootstrapOptions {
  console.log('Loading NativeAdapter');
  return {
    adapters: {
      [AdapterType.FileSystem]: fs as unknown as FileSystemCommon,
      [AdapterType.Path]: path as unknown as PathCommon,
      [AdapterType.Application]: {
        getName() {
          return app.getName();
        },
        getRuntimeVersion() {
          return app.getTauriVersion();
        },
        getVersion() {
          return app.getVersion();
        },
      },
      [AdapterType.Command]: {
        invoke,
        addPluginListener,
      },
      [AdapterType.Events]: events as unknown as EventsCommon,
      [AdapterType.Shell]: shell,
      [AdapterType.Process]: process,
      [AdapterType.Fetch]: http.fetch,
      [AdapterType.Dialog]: dialog as unknown as DialogCommon,
      [AdapterType.WebSocket]: ws as unknown as WebSocketCommon,
      async createStore(name: string) {
        return store.load(name) as unknown as Promise<StoreCommon>;
      },
    },
  };
}
