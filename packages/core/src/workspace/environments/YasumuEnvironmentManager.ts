import type { YasumuWorkspace } from '../YasumuWorkspace.js';

export class YasumuEnvironmentManager {
  /**
   * Creates a new environment manager.
   * @param workspace The workspace this environment manager is associated with.
   */
  public constructor(public readonly workspace: YasumuWorkspace) {}
}
