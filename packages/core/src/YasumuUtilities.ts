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
    const isAbsolute = paths[0]?.startsWith(sep);

    // Normalize and split paths
    const segments = paths.flatMap((path) => {
      if (!path || typeof path !== 'string') return [];
      return path.split(/[/\\]/).filter(Boolean);
    });

    // Join segments and handle absolute paths
    const result = segments.join(sep);
    return isAbsolute ? sep + result : result;
  }
}
