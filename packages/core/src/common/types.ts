import type { WorkspaceNotFoundError } from './errors/index.js';

export type YasumuError = WorkspaceNotFoundError;

export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export * from '@yasumu/common';
