export interface YasumuRawWorkspaceMetadata {
  name: string;
  id: string;
}

export class YasumuWorkspaceMetadata {
  public onChange: (() => unknown) | null = null;
  public constructor(private readonly raw: YasumuRawWorkspaceMetadata) {}

  public get id() {
    return this.raw.id;
  }

  public get name() {
    return this.raw.name;
  }

  public setName(name: string) {
    this.raw.name = name;
    this.onChange?.();
  }

  public toJSON() {
    return this.raw;
  }
}
