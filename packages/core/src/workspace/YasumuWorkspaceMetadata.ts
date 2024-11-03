import { deepMerge, generateId } from '@/common/utils.js';
import type { YasumuWorkspace } from './YasumuWorkspace.js';
import type { DeepPartial, RestIndex } from './modules/index.js';
import { WorkspaceModuleType } from './modules/common/constants.js';
import { YasumuScriptActions } from '@yasumu/schema';
import { WorkspaceSchema } from './schema/WorkspaceSchema.js';

export type RootIndex<T> = { entities: Record<string, T> };

export interface YasumuRawWorkspaceMetadata {
  annotation: 'workspace';
  blocks: {
    Metadata: {
      /**
       * The ID of the workspace.
       */
      id: string;
      /**
       * The name of the workspace.
       */
      name: string;
      /**
       * The date the workspace was created.
       */
      createdAt: string;
      /**
       * The version of the workspace.
       */
      version: string;
    };
    /**
     * The associated REST entities of this workspace.
     */
    [WorkspaceModuleType.Rest]: RootIndex<RestIndex>;
    /**
     * The associated GraphQL entities of this workspace.
     */
    [WorkspaceModuleType.GraphQL]: RootIndex<unknown>;
    /**
     * The associated SMTP entities of this workspace.
     */
    [WorkspaceModuleType.SMTP]: RootIndex<unknown>;
    /**
     * The associated WebSocket entities of this workspace.
     */
    [WorkspaceModuleType.Websocket]: RootIndex<unknown>;
    /**
     * The associated Socket.IO entities of this workspace.
     */
    [WorkspaceModuleType.SocketIO]: RootIndex<unknown>;
    /**
     * The associated SSE entities of this workspace.
     */
    [WorkspaceModuleType.SSE]: RootIndex<unknown>;
  };
}

export type MetadataSetter =
  | ((data: YasumuRawWorkspaceMetadata) => DeepPartial<YasumuRawWorkspaceMetadata>)
  | DeepPartial<YasumuRawWorkspaceMetadata>;

export class YasumuWorkspaceMetadata {
  /**
   * The schema for the workspace metadata.
   */
  public static readonly schema = new YasumuScriptActions(WorkspaceSchema);

  /**
   * The metadata for a workspace.
   * @param workspace The workspace this metadata belongs to.
   * @param data The raw metadata.
   * @param save Whether to save the metadata. Defaults to `false`.
   */
  public constructor(
    public readonly workspace: YasumuWorkspace,
    private data: YasumuRawWorkspaceMetadata,
  ) {
    this.#reformat();
  }

  /**
   * Reformat the metadata. This is used to ensure all metadata is present.
   * @param save Whether to save the metadata.
   */
  #reformat() {
    this.data.annotation = 'workspace';
    this.data.blocks ??= {
      Metadata: {},
    } as typeof this.data.blocks;
    this.data.blocks.Metadata.createdAt ??= new Date().toISOString();
    this.data.blocks.Metadata.version ??= this.workspace.yasumu.apiVersion;
    this.data.blocks.Metadata.name ??= 'Untitled Workspace';
    this.data.blocks.Metadata.id ??= generateId();

    this.data.blocks[WorkspaceModuleType.Rest] ??= { entities: {} };
    this.data.blocks[WorkspaceModuleType.GraphQL] ??= { entities: {} };
    this.data.blocks[WorkspaceModuleType.SMTP] ??= { entities: {} };
    this.data.blocks[WorkspaceModuleType.SSE] ??= { entities: {} };
    this.data.blocks[WorkspaceModuleType.SocketIO] ??= { entities: {} };
    this.data.blocks[WorkspaceModuleType.Websocket] ??= { entities: {} };
  }

  /**
   * The ID of this workspace.
   */
  public get id(): string {
    return this.data.blocks.Metadata.id;
  }

  /**
   * The name of this workspace.
   */
  public get name(): string {
    return this.data.blocks.Metadata.name;
  }

  /**
   * The raw metadata of this workspace.
   */
  public getRawData(): YasumuRawWorkspaceMetadata {
    return this.data;
  }

  /**
   * Sets the name of this workspace.
   * @param value The new name.
   */
  public setName(value: string) {
    this.data.blocks.Metadata.name = value;
  }

  /**
   * Updates the metadata.
   * @param value The value to update the metadata with.
   */
  public update(value: MetadataSetter) {
    let data: DeepPartial<typeof this.data>;

    if (typeof value === 'function') {
      data = value(this.data);
    } else {
      data = value;
    }

    deepMerge(this.data, data);
  }

  /**
   * The date this workspace was created.
   */
  public get createdAt(): Date {
    return new Date(this.data.blocks.Metadata.createdAt);
  }

  /**
   * The version of this workspace.
   */
  public get version(): string {
    return this.data.blocks.Metadata.version;
  }

  /**
   * Refreshes this workspace's metadata.
   */
  public async refresh(): Promise<void> {
    const metadata = await this.workspace.yasumu.fs.readTextFile(this.workspace.metadataPath);
    this.data = this.deserialize(metadata);
    this.#reformat();
  }

  /**
   * Saves this workspace's metadata.
   */
  public async save(): Promise<void> {
    return this.workspace.yasumu.fs.writeTextFile(this.workspace.metadataPath, this.serialize());
  }

  /**
   * Deserializes a string to workspace metadata.
   */
  public deserialize(data: string): YasumuRawWorkspaceMetadata {
    return YasumuWorkspaceMetadata.deserialize(data);
  }

  /**
   * Serializes this workspace's metadata to a string.
   */
  public serialize(): string {
    return YasumuWorkspaceMetadata.serialize(this.data);
  }

  /**
   * Deserializes a string to workspace metadata.
   */
  public static deserialize(data: string): YasumuRawWorkspaceMetadata {
    return this.schema.parse(data) as any;
  }

  /**
   * Serializes this workspace's metadata to a string.
   */
  public static serialize(data: YasumuRawWorkspaceMetadata): string {
    return this.schema.serialize(data as any);
  }

  /**
   * JSON representation of this workspace's metadata.
   */
  public toJSON(): YasumuRawWorkspaceMetadata {
    return this.data;
  }
}

/**
 * Creates a new workspace metadata. This is used when creating a new workspace.
 * @param workspace The workspace to create metadata for.
 * @param options The options to create the workspace with.
 */
export async function createWorkspaceMetadata(
  workspace: YasumuWorkspace,
  options: Partial<YasumuRawWorkspaceMetadata> = {},
  save = false,
): Promise<YasumuWorkspaceMetadata> {
  const metadata = new YasumuWorkspaceMetadata(workspace, options as YasumuRawWorkspaceMetadata);

  if (save) await metadata.save();

  return metadata;
}
