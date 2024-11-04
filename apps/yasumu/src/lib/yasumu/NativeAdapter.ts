/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdapterType,
  DialogCommon,
  EventsCommon,
  FileSystemCommon,
  PathCommon,
  StoreCommon,
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
      [AdapterType.Store]: (() => {
        let _store: store.Store;

        store.load('yasumu-store.json').then((s) => {
          _store = s;
        });

        return {
          delete(key) {
            return _store.delete(key);
          },
          entries() {
            return _store.entries();
          },
          get(key) {
            return _store.get(key);
          },
          set(key, value) {
            return _store.set(key, value);
          },
          has(key) {
            return _store.has(key);
          },
          keys() {
            return _store.keys();
          },
          length() {
            return _store.length();
          },
          async load() {
            // return _store.load();
          },
          onChange(cb: any) {
            return _store.onChange(cb);
          },
          onKeyChange(key, cb: any) {
            return _store.onKeyChange(key, cb);
          },
          reset() {
            return _store.reset();
          },
          save() {
            return _store.save();
          },
          values() {
            return _store.values();
          },
        } as StoreCommon;
      })(),
    },
  };
}
