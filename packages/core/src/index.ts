import { Yasumu, type YasumuBootstrapOptions } from './Yasumu.js';

/**
 * Creates a new Yasumu instance.
 * @param options The options to bootstrap the application with.
 * @returns The new Yasumu instance.
 */
export function createYasumu(options: YasumuBootstrapOptions): Yasumu {
  return new Yasumu(options);
}

export * from './Yasumu.js';
export * from './YasumuUtilities.js';
export * from './workspace/index.js';
export * from './common/index.js';
