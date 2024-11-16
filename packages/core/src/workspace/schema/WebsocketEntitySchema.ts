import { t, type YasumuSchemaParsableToType } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const WebsocketEntitySchema = t.script({
  annotation: WorkspaceModuleType && WorkspaceModuleType.Websocket ? WorkspaceModuleType.Websocket : 'WebSocket',
  blocks: {
    Metadata: t.object({
      name: t.string(),
      id: t.string(),
      createdAt: t.number(),
      path: t.string(),
    }),
  },
});

export type WebsocketEntitySchemaType = YasumuSchemaParsableToType<typeof WebsocketEntitySchema>;
