import type { YasumuWorkspace } from '@/workspace/YasumuWorkspace.js';
import type { WorkspaceModuleType } from './constants.js';

export abstract class YasumuBaseModule {
  public abstract readonly type: WorkspaceModuleType;

  /**
   * The base module for Yasumu.
   * @param workspace The current workspace.
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}

  /**
   * Get the location of this module.
   */
  public async getLocation(): Promise<string> {
    return this.workspace.resolvePath(this.type);
  }
}
