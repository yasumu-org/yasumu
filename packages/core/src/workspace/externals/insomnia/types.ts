export interface InsomniaCollection {
  _type: string;
  __export_format: number;
  __export_date: string;
  __export_source: string;
  resources: Resource[];
}

export interface Resource {
  _id: string;
  parentId?: string | null;
  modified: number;
  created: number;
  name: string;
  url?: string;
  metaSortKey?: number;
  headers?: Header[];
  authentication?: Authentication;
  parameters?: any[];
  pathParameters?: any[];
  settingEncodeUrl?: boolean;
  settingStoreCookies?: boolean;
  settingSendCookies?: boolean;
  settingFollowRedirects?: string;
  description?: string;
  _type: string;
  scope?: string;
  method?: string;
  body?: Body;
  isPrivate?: boolean;
  settingDisableRenderRequestBody?: boolean;
  settingRebuildPath?: boolean;
  protoFileId?: string;
  protoMethodName?: string;
  metadata?: any[];
  reflectionApi?: ReflectionApi;
  data?: Data;
  dataPropertyOrder: any;
  color: any;
  cookies?: any[];
}

export interface Header {
  name: string;
  value: string;
}

export interface Authentication {}

export interface Body {
  text?: string;
  mimeType?: string;
}

export interface ReflectionApi {
  enabled: boolean;
  url: string;
  apiKey: string;
  module: string;
}

export interface Data {}
