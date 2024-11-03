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
    const normalized = paths.flatMap((p, i) => {
      if (!p || typeof p !== 'string') return;
      if (!p.includes(sep)) return p;
      if (i === 0) return p;
      return p.split(sep);
    });

    return normalized
      .filter((p) => {
        return p && typeof p === 'string' && p.length > 0 && p !== sep;
      })
      .join(sep);
  }
}
