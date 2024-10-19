import type {
  PathCommon,
  FileSystemCommon,
  StoreCommon,
  CommandCommon,
  DialogCommon,
  ProcessCommon,
  ApplicationCommon,
  EventsCommon,
} from './types/index.js';
import type { ShellCommon } from './types/shell.js';

export type AdapterCommon =
  | PathCommon
  | FileSystemCommon
  | StoreCommon
  | CommandCommon
  | DialogCommon
  | ProcessCommon
  | ApplicationCommon
  | EventsCommon
  | ShellCommon;

export const AdapterType = {
  Path: 'path',
  FileSystem: 'fs',
  Store: 'store',
  Command: 'command',
  Dialog: 'dialog',
  Process: 'process',
  Application: 'app',
  Events: 'events',
  Shell: 'shell',
} as const;

export type AdapterType = (typeof AdapterType)[keyof typeof AdapterType];

export interface AdapterCommonMap {
  [AdapterType.Path]: PathCommon;
  [AdapterType.FileSystem]: FileSystemCommon;
  [AdapterType.Store]: StoreCommon;
  [AdapterType.Command]: CommandCommon;
  [AdapterType.Dialog]: DialogCommon;
  [AdapterType.Process]: ProcessCommon;
  [AdapterType.Application]: ApplicationCommon;
  [AdapterType.Events]: EventsCommon;
  [AdapterType.Shell]: ShellCommon;
}

export type Config<YasumuAdapterType extends AdapterType> = AdapterCommonMap[YasumuAdapterType];

export function createAdapter<YasumuAdapterType extends AdapterType>(
  type: YasumuAdapterType,
  config: Config<YasumuAdapterType>,
): Config<YasumuAdapterType> {
  if (!(type in AdapterType)) {
    throw new Error(`Invalid adapter type "${type}". Must be one of: ${Object.keys(AdapterType).join(', ')}`);
  }

  for (const key in config) {
    if (config[key] === undefined) {
      throw new Error(`[${type}] Missing required config value: ${key}`);
    }
  }

  return config;
}
