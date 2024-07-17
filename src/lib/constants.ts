export type HttpMethods = (typeof HttpMethods)[keyof typeof HttpMethods];

export const HttpMethodColors: Record<HttpMethods, string> = {
  DELETE: 'text-red-500',
  GET: 'text-green-500',
  HEAD: 'text-purple-500',
  OPTIONS: 'text-pink-500',
  PATCH: 'text-yellow-500',
  POST: 'text-blue-500',
  PUT: 'text-cyan-500',
};

export const HttpMethods = {
  DELETE: 'DELETE',
  GET: 'GET',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
} as const;

export const HttpMethodsArray = Object.values(HttpMethods) as [HttpMethods];

export const Commands = {
  GetLocalAddress: 'get_local_address',
} as const;

export type Commands = (typeof Commands)[keyof typeof Commands];
