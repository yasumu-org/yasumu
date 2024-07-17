export interface WorkspaceEntity<T> {
  name: string;
  data: T;
}

export enum EntityType {
  Directory = 'directory',
  File = 'file',
}

export interface BaseEntity {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestResponse {
  status: number;
  bytes: number;
  headers: Record<string, string>;
  body: string;
  bodyType: string;
}

export interface RestProperties {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  bodyType: string;
  response: RestResponse;
}

export interface RestEntity extends BaseEntity {
  type: EntityType;
  properties: RestProperties;
}

export interface GraphqlEntity extends BaseEntity {}
export interface WebsocketEntity extends BaseEntity {}
export interface SocketIoEntity extends BaseEntity {}
export interface MqttEntity extends BaseEntity {}
export interface SmtpEntity extends BaseEntity {}

export interface IWorkspaceEntities {
  rest: WorkspaceEntity<RestEntity>;
  graphql: WorkspaceEntity<GraphqlEntity>;
  websocket: WorkspaceEntity<WebsocketEntity>;
  socketio: WorkspaceEntity<SocketIoEntity>;
  mqtt: WorkspaceEntity<MqttEntity>;
  smtp: WorkspaceEntity<SmtpEntity>;
}

export interface IWorkspace {
  name: string;
  entities: IWorkspaceEntities;
}
