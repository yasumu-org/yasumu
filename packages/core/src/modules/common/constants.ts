import { YasumuGraphqlEntity } from '../graphql/YasumuGraphqlEntity.js';
import { YasumuRestEntity } from '../rest/YasumuRestEntity.js';
import { YasumuSmtpEntity } from '../smtp/YasumuSmtpEntity.js';
import { YasumuSocketIOEntity } from '../socketio/YasumuSocketIOEntity.js';
import { YasumuSseEntity } from '../sse/YasumuSseEntity.js';
import { YasumuWebSocketEntity } from '../websocket/YasumuWebSocketEntity.js';
import type { YasumuEntityDataMap } from './types.js';

export const WorkspaceModuleType = {
  Rest: 'Rest',
  GraphQL: 'GraphQL',
  Websocket: 'WebSocket',
  SocketIO: 'SocketIO',
  SSE: 'SSE',
  SMTP: 'SMTP',
} as const;

export type WorkspaceModuleType = (typeof WorkspaceModuleType)[keyof typeof WorkspaceModuleType];

export const YasumuEntityMap = {
  [WorkspaceModuleType.Rest]: YasumuRestEntity,
  [WorkspaceModuleType.GraphQL]: YasumuGraphqlEntity,
  [WorkspaceModuleType.SMTP]: YasumuSmtpEntity,
  [WorkspaceModuleType.SSE]: YasumuSseEntity,
  [WorkspaceModuleType.SocketIO]: YasumuSocketIOEntity,
  [WorkspaceModuleType.Websocket]: YasumuWebSocketEntity,
};

export type YasumuEntityMap = {
  [K in keyof YasumuEntityDataMap]: InstanceType<(typeof YasumuEntityMap)[K]>;
};
