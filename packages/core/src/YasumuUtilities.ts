import type { Yasumu } from './Yasumu.js';

export class YasumuUtilities {
  public constructor(public readonly yasumu: Yasumu) {}

  /**
   * Synchronously joins the paths together.
   * @param paths The paths to join.
   * @returns The joined path.
   */
  public joinPathSync(...paths: string[]): string {
    const sep = this.yasumu.path.sep();
    return paths.join(sep);
  }
}
