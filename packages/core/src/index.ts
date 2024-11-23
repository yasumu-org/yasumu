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
export * from './modules/index.js';
export * from './YasumuWorkspace.js';
export * from './YasumuWorkspaceMetadata.js';
export * from './runtime/index.js';
export * from './schema/index.js';
export * from './network/index.js';
export * from './externals/index.js';
export * from './standalone/index.js';
export * from './events/index.js';
export * from './environments/index.js';
export * from './common/index.js';
