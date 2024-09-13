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
  DialogCommon,
  Commands,
} from '@yasumu/core';
import * as app from '@tauri-apps/api/app';
import { invoke, addPluginListener } from '@tauri-apps/api/core';
import * as shell from '@tauri-apps/plugin-shell';
import * as process from '@tauri-apps/plugin-process';
import { toast } from 'sonner';

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
  dialog: dialog as unknown as DialogCommon,
  path: path as unknown as PathCommon,
  events: events as EventsCommon,
  scripts: {
    async evaluate<T>(script: string, contextData: string, config: Record<string, unknown>): Promise<T> {
      try {
        const prescript = `Yasumu.setContextData(${contextData});`;
        const result = await Yasumu.commands.invoke<string>(Commands.EvaluateJavaScript, {
          code: script,
          prepare: prescript,
          id: Yasumu.workspace?.metadata.id ?? config.id ?? 'anonymous',
          typescript: typeof config.typescript === 'boolean' ? config.typescript : true,
          test: !!config.test,
        });

        try {
          const res = JSON.parse(result);

          return res as unknown as T;
        } catch {
          try {
            const res = JSON.parse(result.slice(1, -1));

            return res as unknown as T;
          } catch {
            return result as unknown as T;
          }
        }
      } catch (e: any) {
        toast.error('Failed to evaluate script!', { description: String(e) });
        return {
          $result: null,
          $error: String((e && e.stack) || e),
        } as unknown as T;
      }
    },
  } satisfies ScriptsCommon,
  commands: {
    invoke,
    addPluginListener,
  },
  process,
  shell,
});
