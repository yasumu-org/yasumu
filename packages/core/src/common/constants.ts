export const YasumuFileNamesMap = {
  WorkspaceMetadata: 'yasumu-workspace.json',
} as const;

export const YASUMU_API_VERSION = '0.0' as const;

export const HttpMethod = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Patch: 'PATCH',
  Delete: 'DELETE',
  Options: 'OPTIONS',
  Head: 'HEAD',
  Connect: 'CONNECT',
  Trace: 'TRACE',
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
