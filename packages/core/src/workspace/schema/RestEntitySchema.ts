import type { YasumuSchemaParasableScript } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const RestEntitySchema = {
  annotation: WorkspaceModuleType.Rest,
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
        method: {
          schema: {
            type: 'string',
          },
          required: true,
        },
      },
      required: true,
    },
    Request: {
      type: 'object',
      schema: {
        url: {
          schema: {
            type: 'string',
          },
          required: true,
        },
        headers: {
          schema: {
            type: 'list',
            schema: {
              type: 'object',
              schema: {
                key: {
                  schema: {
                    type: 'string',
                  },
                  required: true,
                },
                value: {
                  schema: {
                    type: 'string',
                  },
                  required: true,
                },
              },
            },
          },
          required: false,
        },
      },
      required: true,
    },
    Response: {
      type: 'object',
      schema: {
        status: {
          schema: {
            type: 'number',
          },
          required: false,
        },
        time: {
          schema: {
            type: 'number',
          },
          required: false,
        },
        size: {
          schema: {
            type: 'number',
          },
          required: false,
        },
        headers: {
          schema: {
            type: 'list',
            schema: {
              type: 'object',
              schema: {
                key: {
                  schema: {
                    type: 'string',
                  },
                  required: true,
                },
                value: {
                  schema: {
                    type: 'string',
                  },
                  required: true,
                },
              },
            },
          },
          required: false,
        },
        body: {
          schema: {
            type: 'string',
          },
          required: false,
        },
      },
      required: true,
    },
  },
} as const satisfies YasumuSchemaParasableScript;
