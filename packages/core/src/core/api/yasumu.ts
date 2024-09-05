import {
  YasumuWorkspace,
  type YasumuWorkspaceHistory,
} from './workspace/YasumuWorkspace.js';
import {
  YasumuStoreKeys,
  YasumuWorkspaceFiles,
} from './workspace/constants.js';
import { Commands } from '../common/commands.js';
import type {
  StoreCommon,
  FileSystemCommon,
  PathCommon,
  CommandCommon,
  DialogCommon,
  ProcessCommon,
  ApplicationCommon,
  EventsCommon,
} from '../../externals/types/index.js';
import type { FetchCommon } from '../../externals/types/fetch.js';
import type { ScriptsCommon } from '@/scripts/types.js';
import { YasumuScripts } from '@/scripts/YasumuScripts.js';
import type { ShellCommon } from '@/externals/types/shell.js';

export class YasumuCore {
  /**
   * The scripts manager. Used to manage and execute scripts.
   */
  public readonly scripts: YasumuScripts;
  /**
   * The store manager. Used to store and retrieve data in key-value pairs.
   */
  public readonly store: StoreCommon;
  /**
   * The commands manager.
   */
  public readonly commands: CommandCommon;
  /**
   * The file system manager.
   */
  public readonly fs: FileSystemCommon;
  /**
   * The path utilities.
   */
  public readonly path: PathCommon;
  /**
   * The fetch implementation to use.
   */
  public readonly fetch: FetchCommon;
  /**
   * The dialog manager.
   */
  public readonly dialog: DialogCommon;
  /**
   * The process manager.
   */
  public readonly process: ProcessCommon;
  /**
   * The application manager.
   */
  public readonly app: ApplicationCommon;
  /**
   * The events manager.
   */
  public readonly events: EventsCommon;
  /**
   * Utility to execute shell commands.
   */
  public readonly shell: ShellCommon;
  /**
   * The function to create a key-value store.
   */
  public readonly createStore: YasumuCreate<[string], StoreCommon>;
  /**
   * The current workspace.
   */
  public workspace: YasumuWorkspace | null = null;

  /**
   * Create a new YasumuCore instance
   * @param config The configuration for the core
   */
  public constructor(config: YasumuCoreConfiguration) {
    this.createStore = config.createStore;
    this.store = config.createStore(YasumuWorkspaceFiles.StorePath);
    this.commands = config.commands;
    this.fs = config.fs;
    this.path = config.path;
    this.fetch = config.fetch;
    this.dialog = config.dialog;
    this.process = config.process;
    this.app = config.app;
    this.events = config.events;
    this.shell = config.shell;
    this.scripts = new YasumuScripts(this, config.scripts);
  }

  /**
   * Retrieve the current workspace path
   */
  public async getCurrentWorkspacePath() {
    return this.commands.invoke<string | null>(Commands.GetCurrentWorkspace);
  }

  /**
   * Restore the workspace from the active session. If no session is active, returns null.
   */
  public async restoreWorkspace() {
    const session = await this.getCurrentWorkspacePath();

    if (session) {
      return this.openWorkspace(session);
    }

    return null;
  }

  /**
   * Opens a workspace at the given path
   * @param path The path to the workspace
   * @returns The workspace instance
   */
  public async openWorkspace(path: string) {
    const workspace = new YasumuWorkspace(this, {
      path,
    });

    await workspace.loadMetadata();
    await workspace.createSession();

    this.workspace = workspace;

    return workspace;
  }

  /**
   * Close the current workspace
   */
  public async closeWorkspace() {
    if (this.workspace) {
      await this.workspace.destroySession();
      this.workspace = null;
    }
  }

  /**
   * Retrieve the history of workspaces
   */
  public async getWorkspacesHistory() {
    const history =
      (await this.store.get<YasumuWorkspaceHistory[]>(
        YasumuStoreKeys.YasumuWorkspaces
      )) ?? [];

    return history;
  }

  /**
   * Clears the history of workspaces
   */
  public async clearWorkspacesHistory() {
    await this.store.set(YasumuStoreKeys.YasumuWorkspaces, []).catch(Object);
  }
}

export type YasumuCreate<T extends unknown[] = void[], R = unknown> = (
  ...args: T
) => R;

export interface YasumuCoreConfiguration {
  createStore: YasumuCreate<[string], StoreCommon>;
  fs: FileSystemCommon;
  path: PathCommon;
  commands: CommandCommon;
  fetch: FetchCommon;
  dialog: DialogCommon;
  process: ProcessCommon;
  app: ApplicationCommon;
  events: EventsCommon;
  scripts: ScriptsCommon;
  shell: ShellCommon;
}

/**
 * Create a new YasumuCore instance
 * @param config The configuration for the core
 * @returns The YasumuCore instance
 */
export function createYasumu(config: YasumuCoreConfiguration): YasumuCore {
  return new YasumuCore(config);
}
