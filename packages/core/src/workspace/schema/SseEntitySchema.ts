import { t, type YasumuSchemaParsableToType } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const SseEntitySchema = t.script({
  annotation: WorkspaceModuleType && WorkspaceModuleType.SSE ? WorkspaceModuleType.SSE : 'SSE',
  blocks: {
    Metadata: t.object({
      name: t.string(),
      id: t.string(),
      createdAt: t.number(),
      path: t.string(),
    }),
  },
});

export type SseEntitySchemaType = YasumuSchemaParsableToType<typeof SseEntitySchema>;
