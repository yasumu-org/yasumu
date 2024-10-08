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

interface ConfigMap {
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

export type Config<ConfigType extends AdapterType> = ConfigMap[ConfigType];

export function createAdapter<ConfigType extends AdapterType>(
  type: ConfigType,
  config: Config<ConfigType>,
): Config<ConfigType> {
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
