export interface YaakCollection {
  yaakVersion: string;
  yaakSchema: number;
  timestamp: string;
  resources: Resources;
}

export interface Resources {
  workspaces: Workspace[];
  environments: any[];
  folders: any[];
  httpRequests: HttpRequest[];
  grpcRequests: GrpcRequest[];
}

export interface Workspace {
  model: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  variables: any[];
  settingValidateCertificates: boolean;
  settingFollowRedirects: boolean;
  settingRequestTimeout: number;
}

export interface HttpRequest {
  model: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  folderId: any;
  authentication: Authentication;
  authenticationType: any;
  body: Body;
  bodyType?: string;
  headers: Header[];
  method: string;
  name: string;
  sortPriority: number;
  url: string;
  urlParameters: any[];
}

export interface Authentication {}

export interface Body {
  query?: string;
  variables?: string;
  text?: string;
}

export interface Header {
  enabled: boolean;
  name: string;
  value: string;
}

export interface GrpcRequest {
  model: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  folderId: any;
  authenticationType: any;
  authentication: Authentication2;
  message: string;
  metadata: any[];
  method: any;
  name: string;
  service: any;
  sortPriority: number;
  url: string;
}

export interface Authentication2 {}
