import type { YasumuEnvironment } from '../environments/YasumuEnvironment.js';
import type { YasumuWorkspace } from '../YasumuWorkspace.js';
import type { YasumuWorkspaceMetadata } from '../YasumuWorkspaceMetadata.js';

export const YasumuWorkspaceEvents = {
  // environment events
  EnvironmentUpdated: 'environment:updated',
  EnvironmentCreated: 'environment:created',
  EnvironmentDeleted: 'environment:deleted',
  EnvironmentSelected: 'environment:selected',
  EnvironmentSelectionRemoved: 'environment:selection:removed',

  // workspace events
  WorkspaceCreated: 'workspace:created',
  WorkspaceMetadataUpdated: 'workspace:metadata:updated',
} as const;

export type YasumuWorkspaceEvents = (typeof YasumuWorkspaceEvents)[keyof typeof YasumuWorkspaceEvents];

export interface YasumuWorkspaceEventsMap {
  // environment events
  [YasumuWorkspaceEvents.EnvironmentUpdated]: YasumuEnvironment;
  [YasumuWorkspaceEvents.EnvironmentCreated]: YasumuEnvironment;
  [YasumuWorkspaceEvents.EnvironmentDeleted]: YasumuEnvironment;
  [YasumuWorkspaceEvents.EnvironmentSelected]: YasumuEnvironment;
  [YasumuWorkspaceEvents.EnvironmentSelectionRemoved]: void;

  // workspace events
  [YasumuWorkspaceEvents.WorkspaceCreated]: YasumuWorkspace;
  [YasumuWorkspaceEvents.WorkspaceMetadataUpdated]: YasumuWorkspaceMetadata;
}
