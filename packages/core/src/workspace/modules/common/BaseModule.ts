import type { YasumuWorkspace } from '@/workspace/YasumuWorkspace.js';

export class YasumuBaseModule {
  /**
   * The base module for Yasumu.
   * @param workspace The current workspace.
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}
}
