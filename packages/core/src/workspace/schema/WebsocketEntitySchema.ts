import { t } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const WebsocketEntitySchema = t.script(WorkspaceModuleType.Websocket, {
  Metadata: t.objectBlock({
    name: t.objectValue(t.string()),
    id: t.objectValue(t.string()),
    createdAt: t.objectValue(t.number()),
    path: t.objectValue(t.string()),
  }),
});
