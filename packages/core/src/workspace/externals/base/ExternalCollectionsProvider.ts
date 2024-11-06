import type { YasumuStandaloneFormat } from '@/workspace/standalone/types.js';
import type { YasumuWorkspace } from '@/workspace/YasumuWorkspace.js';

export abstract class ExternalCollectionsProvider<T> {
  public constructor(public readonly workspace: YasumuWorkspace) {}

  public abstract import(data: T): Promise<YasumuStandaloneFormat>;

  public abstract export(): Promise<T>;
}
