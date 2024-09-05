export interface YasumuRawWorkspaceMetadata {
  name: string;
  id: string;
}

export class YasumuWorkspaceMetadata {
  /**
   * The callback to call when the metadata changes
   */
  public onChange: (() => unknown) | null = null;

  /**
   * Create a new YasumuWorkspaceMetadata instance
   * @param raw The raw metadata
   */
  public constructor(private readonly raw: YasumuRawWorkspaceMetadata) {}

  /**
   * Get the ID of the workspace
   */
  public get id() {
    return this.raw.id;
  }

  /**
   * Get the name of the workspace
   */
  public get name() {
    return this.raw.name;
  }

  /**
   * Set the name of the workspace
   * @param name The new name
   */
  public setName(name: string) {
    this.raw.name = name;
    this.onChange?.();
  }

  /**
   * Transform the metadata into a JSON object
   * @returns The raw metadata
   */
  public toJSON() {
    return this.raw;
  }
}
