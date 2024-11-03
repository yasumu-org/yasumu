import type { YasumuSchemaParasableScript } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const GraphqlEntitySchema = {
  annotation: WorkspaceModuleType.GraphQL,
  blocks: {
    Metadata: {
      type: 'object',
      schema: {
        name: {
          schema: {
            type: 'string',
          },
          required: true,
        },
        id: {
          schema: {
            type: 'string',
          },
          required: true,
        },
        createdAt: {
          schema: {
            type: 'number',
          },
          required: true,
        },
        path: {
          schema: {
            type: 'string',
          },
          required: true,
        },
      },
      required: true,
    },
  },
} as const satisfies YasumuSchemaParasableScript;
