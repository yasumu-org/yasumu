import {
  type YasumuRawWorkspaceMetadata,
  YasumuWorkspaceMetadata,
} from './YasumuWorkspaceMetadata.js';
import type { YasumuCore } from '../yasumu.js';
import { YasumuRest } from './modules/rest/YasumuRest.js';
import { YasumuSmtp } from './modules/smtp/YasumuSmtp.js';
import { YasumuStoreKeys, YasumuWorkspaceFiles } from './constants.js';
import {
  Commands,
  type CommandsInvocationMap,
} from '@/core/common/commands.js';
import type { StoreCommon } from '@/externals/index.js';

export interface YasumuWorkspaceInit {
  path: string;
}

export interface YasumuWorkspaceHistory {
  name: string;
  path: string;
}

export class YasumuWorkspace {
  private _kv: StoreCommon | null = null;
  public metadata!: YasumuWorkspaceMetadata;
  public readonly rest: YasumuRest;
  public readonly smtp: YasumuSmtp;

  /**
   * Create a new YasumuWorkspace
   * @param yasumu The parent YasumuCore instance
   * @param options The options for this workspace
   */
  public constructor(
    public readonly yasumu: YasumuCore,
    private readonly options: YasumuWorkspaceInit
  ) {
    this.rest = new YasumuRest(this);
    this.smtp = new YasumuSmtp(this);
  }

  /**
   * Open the key-value store for this workspace
   */
  public openKV() {
    if (this._kv) return this._kv;

    const name = this.metadata.id;

    this._kv = this.yasumu.createStore(name);

    return this._kv;
  }

  /**
   * Retrieve the path of the workspace
   */
  public getPath() {
    return this.options.path;
  }

  /**
   * Loads the necessary metadata for the workspace
   */
  public async loadMetadata() {
    const path = YasumuWorkspace.resolvePath(
      this.yasumu,
      this.options.path,
      YasumuWorkspaceFiles.Metadata
    );

    const hasMetadata = await this.yasumu.fs.exists(path);

    if (hasMetadata) {
      const content = await this.yasumu.fs.readTextFile(path);
      const metadata: YasumuRawWorkspaceMetadata = JSON.parse(content);

      this.metadata = new YasumuWorkspaceMetadata(metadata);
      this.metadata.onChange = () => this.writeMetadata();
    } else {
      const metadata: YasumuRawWorkspaceMetadata = {
        id: crypto.randomUUID(),
        name:
          this.getPath().split(this.yasumu.path.sep()).pop() ?? 'New Workspace',
      };

      this.metadata = new YasumuWorkspaceMetadata(metadata);
      this.metadata.onChange = () => this.writeMetadata();
      await this.writeMetadata();
    }

    await this.saveHistory();
  }

  /**
   * Write the metadata to the workspace
   */
  public async writeMetadata() {
    const path = YasumuWorkspace.resolvePath(
      this.yasumu,
      this.options.path,
      YasumuWorkspaceFiles.Metadata
    );

    await this.yasumu.fs.writeTextFile(path, JSON.stringify(this.metadata));
  }

  /**
   * Save the workspace to the history
   */
  public async saveHistory() {
    try {
      const history = await this.yasumu.getWorkspacesHistory();

      const index = history.findIndex(
        (item) => item.path === this.options.path
      );

      if (index !== -1) {
        history[index].name = this.metadata.name;
      } else {
        history.unshift({
          name: this.metadata.name,
          path: this.options.path,
        });
      }

      history.length = Math.min(history.length, 10);

      await this.yasumu.store.set(YasumuStoreKeys.YasumuWorkspaces, history);
    } catch {
      // noop
    }
  }

  /**
   * Create a new session for the workspace
   */
  public async createSession() {
    const path = this.getPath();

    await this.send(Commands.SetCurrentWorkspace, { path });
  }

  /**
   * Clears the workspace session
   */
  public async destroySession() {
    await this.send(Commands.ClearCurrentWorkspaceSession, {});
  }

  /**
   * Resolve a path for a file in the workspace
   * @param file The file to resolve
   * @returns The resolved path
   */
  public resolvePath(file: YasumuWorkspaceFiles) {
    return YasumuWorkspace.resolvePath(this.yasumu, this.options.path, file);
  }

  /**
   * Send a command to the workspace
   * @param command The command to send
   * @param data The data to send
   * @returns The result of the command
   */
  public async send<
    Cmd extends Commands,
    InvocationData extends CommandsInvocationMap[Cmd],
  >(command: Cmd, data: InvocationData[0]): Promise<InvocationData[1]> {
    return this.yasumu.commands.invoke(command, data);
  }

  /**
   * Resolve a path for a file in the workspace
   * @param yasumu The parent YasumuCore instance
   * @param workspacePath The path to the workspace
   * @param file The file to resolve
   * @returns The resolved path
   */
  public static resolvePath(
    yasumu: YasumuCore,
    workspacePath: string,
    file: YasumuWorkspaceFiles
  ) {
    if (workspacePath.endsWith(file)) {
      return workspacePath;
    }

    return `${workspacePath}${yasumu.path.sep()}${file}`;
  }
}
