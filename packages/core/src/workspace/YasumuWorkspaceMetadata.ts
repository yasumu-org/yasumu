import { generateId } from '@/common/utils.js';
import type { YasumuWorkspace } from './YasumuWorkspace.js';

export interface YasumuRawWorkspaceMetadata {
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
}

export class YasumuWorkspaceMetadata {
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
    this.data.createdAt ??= new Date().toISOString();
    this.data.version ??= this.workspace.yasumu.apiVersion;
    this.data.name ??= 'Untitled Workspace';
    this.data.id ??= generateId();
  }

  /**
   * The ID of this workspace.
   */
  public get id(): string {
    return this.data.id;
  }

  /**
   * The name of this workspace.
   */
  public get name(): string {
    return this.data.name;
  }

  /**
   * Sets the name of this workspace.
   * @param value The new name.
   */
  public setName(value: string) {
    this.data.name = value;
  }

  /**
   * The date this workspace was created.
   */
  public get createdAt(): Date {
    return new Date(this.data.createdAt);
  }

  /**
   * The version of this workspace.
   */
  public get version(): string {
    return this.data.version;
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
    return JSON.parse(data);
  }

  /**
   * Serializes this workspace's metadata to a string.
   */
  public serialize(): string {
    return JSON.stringify(this.data, null, 2);
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
