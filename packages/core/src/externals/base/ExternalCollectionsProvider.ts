import type { YasumuStandaloneFormat } from '@/standalone/types.js';
import type { YasumuWorkspace } from '@/YasumuWorkspace.js';

export abstract class ExternalCollectionsProvider<T> {
  public constructor(public readonly workspace: YasumuWorkspace) {}

  public abstract import(data: T): Promise<YasumuStandaloneFormat>;

  public abstract export(): Promise<T>;
}
