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

export type Config<ConfigType extends AdapterType> =
  ConfigType extends (typeof AdapterType)['Path']
    ? PathCommon
    : ConfigType extends (typeof AdapterType)['FileSystem']
    ? FileSystemCommon
    : ConfigType extends (typeof AdapterType)['Store']
    ? StoreCommon
    : ConfigType extends (typeof AdapterType)['Command']
    ? CommandCommon
    : ConfigType extends (typeof AdapterType)['Dialog']
    ? DialogCommon
    : ConfigType extends (typeof AdapterType)['Process']
    ? ProcessCommon
    : ConfigType extends (typeof AdapterType)['Application']
    ? ApplicationCommon
    : ConfigType extends (typeof AdapterType)['Events']
    ? EventsCommon
    : ConfigType extends (typeof AdapterType)['Shell']
    ? ShellCommon
    : never;

export function createAdapter<ConfigType extends AdapterType>(
  type: ConfigType,
  config: Config<ConfigType>
): Config<ConfigType> {
  if (!(type in AdapterType)) {
    throw new Error(
      `Invalid adapter type "${type}". Must be one of: ${Object.keys(
        AdapterType
      ).join(', ')}`
    );
  }

  for (const key in config) {
    if (config[key] === undefined) {
      throw new Error(`[${type}] Missing required config value: ${key}`);
    }
  }

  return config;
}
