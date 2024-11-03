import type { YasumuSchemaParasableScript } from '@yasumu/schema';
import { WorkspaceModuleType } from '../modules/index.js';

export const WorkspaceSchema = {
  annotation: 'workspace',
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
        version: {
          schema: {
            type: 'string',
          },
          required: true,
        },
      },
      required: true,
    },
    [WorkspaceModuleType.Rest]: {
      required: true,
      type: 'object',
      schema: {
        entities: {
          schema: {
            type: 'record',
            schema: {
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
                method: {
                  schema: {
                    type: 'string',
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
            },
          },
          required: true,
        },
      },
    },
    [WorkspaceModuleType.GraphQL]: {
      required: true,
      type: 'object',
      schema: {
        entities: {
          schema: {
            type: 'record',
            schema: {
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
                method: {
                  schema: {
                    type: 'string',
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
            },
          },
          required: true,
        },
      },
    },
    [WorkspaceModuleType.SMTP]: {
      required: true,
      type: 'object',
      schema: {
        entities: {
          schema: {
            type: 'record',
            schema: {
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
                method: {
                  schema: {
                    type: 'string',
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
            },
          },
          required: true,
        },
      },
    },
    [WorkspaceModuleType.SSE]: {
      required: true,
      type: 'object',
      schema: {
        entities: {
          schema: {
            type: 'record',
            schema: {
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
                method: {
                  schema: {
                    type: 'string',
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
            },
          },
          required: true,
        },
      },
    },
    [WorkspaceModuleType.SocketIO]: {
      required: true,
      type: 'object',
      schema: {
        entities: {
          schema: {
            type: 'record',
            schema: {
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
                method: {
                  schema: {
                    type: 'string',
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
            },
          },
          required: true,
        },
      },
    },
    [WorkspaceModuleType.Websocket]: {
      required: true,
      type: 'object',
      schema: {
        entities: {
          schema: {
            type: 'record',
            schema: {
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
                method: {
                  schema: {
                    type: 'string',
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
            },
          },
          required: true,
        },
      },
    },
  },
} as const satisfies YasumuSchemaParasableScript;
