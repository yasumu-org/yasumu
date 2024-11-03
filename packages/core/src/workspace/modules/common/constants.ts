export const WorkspaceModuleType = {
  Rest: 'rest',
  GraphQL: 'graphql',
  Websocket: 'websocket',
  SocketIO: 'socketio',
  SSE: 'sse',
  SMTP: 'smtp',
} as const;
export type WorkspaceModuleType = (typeof WorkspaceModuleType)[keyof typeof WorkspaceModuleType];
