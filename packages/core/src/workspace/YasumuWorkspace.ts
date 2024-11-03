import { YasumuFileNamesMap } from '@/common/constants.js';
import { WorkspaceNotFoundError } from '@/common/errors/WorkspaceNotFoundError.js';
import type { Yasumu } from '@/Yasumu.js';
import { createWorkspaceMetadata, YasumuWorkspaceMetadata } from './YasumuWorkspaceMetadata.js';
import { WorkspaceNotLoadedError } from '@/common/index.js';
import { YasumuGraphql, YasumuRest, YasumuSmtp, YasumuSocketIO, YasumuWebSocket } from './modules/index.js';
import type { BaseScriptRuntime } from './runtime/BaseScriptRuntime.js';
import { YasumuIndexerService } from './indexer/YasumuIndexerService.js';
import { WorkspaceModuleType } from './modules/common/constants.js';

export interface YasumuWorkspaceOptions {
  /**
   * The path to this workspace.
   */
  path: string;
  /**
   * Whether to create the workspace if it does not exist. Defaults to `true`.
   * If set to `false` and the workspace does not exist, an error will be thrown.
   */
  create?: boolean;
}

export class YasumuWorkspace {
  /**
   * The path to the workspace.
   */
  #path!: string;

  /**
   * The path to the workspace metadata.
   */
  #metadataPath!: string;

  /**
   * The metadata for this workspace.
   */
  #metadata!: YasumuWorkspaceMetadata;

  /**
   * The rest module for this workspace.
   */
  public readonly rest = new YasumuRest(this);

  /**
   * The graphql module for this workspace.
   */
  public readonly graphql = new YasumuGraphql(this);

  /**
   * The smtp module for this workspace.
   */
  public readonly smtp = new YasumuSmtp(this);

  /**
   * The websocket module for this workspace.
   */
  public readonly websocket = new YasumuWebSocket(this);

  /**
   * The socket.io module for this workspace.
   */
  public readonly socketio = new YasumuSocketIO(this);

  /**
   * The indexer service for this workspace.
   */
  public readonly indexer = new YasumuIndexerService(this);

  /**
   * The script runtime for this workspace.
   */
  #runtime: BaseScriptRuntime | null = null;

  /**
   * Creates a new Yasumu workspace.
   * @param yasumu The main Yasumu instance.
   * @param options The options to create the workspace with.
   */
  public constructor(
    public readonly yasumu: Yasumu,
    private readonly options: YasumuWorkspaceOptions,
  ) {}

  /**
   * The script runtime environment for this workspace.
   */
  public get runtime() {
    return this.#runtime;
  }

  /**
   * Sets the script runtime environment for this workspace.
   * @param runtime The script runtime to set.
   */
  public setScriptRuntime(runtime: BaseScriptRuntime) {
    this.#runtime = runtime;
  }

  /**
   * The metadata for this workspace.
   */
  public getMetadata(): YasumuWorkspaceMetadata {
    const metadata = this.#metadata;

    if (!metadata) {
      throw new WorkspaceNotLoadedError();
    }

    return metadata;
  }

  /**
   * The path to the workspace metadata.
   */
  public get metadataPath(): string {
    return this.#metadataPath;
  }

  /**
   * The path to the workspace.
   */
  public get path(): string {
    return this.#path;
  }

  /**
   * Loads this workspace's metadata.
   */
  public async loadMetadata(): Promise<YasumuWorkspaceMetadata> {
    const { path, create = true } = this.options;

    this.#metadataPath = await this.yasumu.path.join(path, YasumuFileNamesMap.WorkspaceMetadata);

    const exists = await this.yasumu.fs.exists(this.#metadataPath);

    if (!exists && !create) {
      throw new WorkspaceNotFoundError(path);
    }

    this.#metadata = await createWorkspaceMetadata(this, {}, !exists);

    return this.#metadata;
  }

  /**
   * Resolves a module path relative to this workspace.
   * @param type The type of module to resolve.
   */
  public async resolvePath(type: WorkspaceModuleType) {
    const workspacePath = this.path;

    switch (type) {
      case WorkspaceModuleType.Rest:
        return this.yasumu.path.join(workspacePath, 'rest');
      case WorkspaceModuleType.GraphQL:
        return this.yasumu.path.join(workspacePath, 'graphql');
      case WorkspaceModuleType.SMTP:
        return this.yasumu.path.join(workspacePath, 'smtp');
      case WorkspaceModuleType.Websocket:
        return this.yasumu.path.join(workspacePath, 'websocket');
      case WorkspaceModuleType.SocketIO:
        return this.yasumu.path.join(workspacePath, 'socketio');
      case WorkspaceModuleType.SSE:
        return this.yasumu.path.join(workspacePath, 'sse');
      default:
        throw new TypeError(`Unknown module type: ${type}`);
    }
  }
}
