import { t } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';
import { YASUMU_WORKSPACE_ANNOTATION } from '@/common/constants.js';

export const WorkspaceSchema = t.script(YASUMU_WORKSPACE_ANNOTATION, {
  Metadata: t.objectBlock({
    name: t.objectValue(t.string()),
    id: t.objectValue(t.string()),
    createdAt: t.objectValue(t.number()),
    version: t.objectValue(t.string()),
  }),
  [WorkspaceModuleType.Rest]: t.objectBlock({
    entities: t.objectValue(
      t.record(
        t.object({
          name: t.objectValue(t.string()),
          id: t.objectValue(t.string()),
          method: t.objectValue(t.string()),
          path: t.objectValue(t.string()),
        }),
      ),
    ),
  }),
  [WorkspaceModuleType.GraphQL]: t.objectBlock({
    entities: t.objectValue(
      t.record(
        t.object({
          name: t.objectValue(t.string()),
          id: t.objectValue(t.string()),
          method: t.objectValue(t.string()),
          path: t.objectValue(t.string()),
        }),
      ),
    ),
  }),
  [WorkspaceModuleType.SMTP]: t.objectBlock({
    entities: t.objectValue(
      t.record(
        t.object({
          name: t.objectValue(t.string()),
          id: t.objectValue(t.string()),
          path: t.objectValue(t.string()),
        }),
      ),
    ),
  }),
  [WorkspaceModuleType.Websocket]: t.objectBlock({
    entities: t.objectValue(
      t.record(
        t.object({
          name: t.objectValue(t.string()),
          id: t.objectValue(t.string()),
          path: t.objectValue(t.string()),
        }),
      ),
    ),
  }),
  [WorkspaceModuleType.SocketIO]: t.objectBlock({
    entities: t.objectValue(
      t.record(
        t.object({
          name: t.objectValue(t.string()),
          id: t.objectValue(t.string()),
          path: t.objectValue(t.string()),
        }),
      ),
    ),
  }),
  [WorkspaceModuleType.SSE]: t.objectBlock({
    entities: t.objectValue(
      t.record(
        t.object({
          name: t.objectValue(t.string()),
          id: t.objectValue(t.string()),
          method: t.objectValue(t.string()),
          path: t.objectValue(t.string()),
        }),
      ),
    ),
  }),
});
