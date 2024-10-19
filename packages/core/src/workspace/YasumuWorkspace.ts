import { YasumuFileNamesMap } from '@/common/constants.js';
import { WorkspaceNotFoundError } from '@/common/errors/WorkspaceNotFoundError.js';
import type { Yasumu } from '@/Yasumu.js';
import { createWorkspaceMetadata, YasumuWorkspaceMetadata } from './YasumuWorkspaceMetadata.js';
import { WorkspaceNotLoadedError } from '@/common/index.js';
import { YasumuGraphql, YasumuRest, YasumuSmtp, YasumuSocketIO, YasumuWebSocket } from './modules/index.js';
import { TanxiumRuntime } from './runtime/TanxiumRuntime.js';
import type { BaseJavaScriptRuntime } from './runtime/BaseJavaScriptRuntime.js';

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
   * The javascript runtime for this workspace.
   */
  #runtime: BaseJavaScriptRuntime | null = null;

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
   * The JavaScript runtime environment for this workspace.
   */
  public get runtime() {
    return this.#runtime;
  }

  /**
   * Sets the JavaScript runtime environment for this workspace.
   * @param runtime The JavaScript runtime to set.
   */
  public setJavaScriptRuntime(runtime: BaseJavaScriptRuntime) {
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
}
