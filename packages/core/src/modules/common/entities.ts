import { YasumuGraphqlEntity } from '../graphql/YasumuGraphqlEntity.js';
import { YasumuRestEntity } from '../rest/YasumuRestEntity.js';
import { YasumuSmtpEntity } from '../smtp/YasumuSmtpEntity.js';
import { YasumuSocketIOEntity } from '../socketio/YasumuSocketIOEntity.js';
import { YasumuSseEntity } from '../sse/YasumuSseEntity.js';
import { YasumuWebSocketEntity } from '../websocket/YasumuWebSocketEntity.js';
import { WorkspaceModuleType } from './constants.js';
import type { YasumuEntityDataMap } from './types.js';

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
