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

export const HttpMethodBackgroundColors: Record<HttpMethods, string> = {
  DELETE: 'bg-red-500',
  GET: 'bg-green-500',
  HEAD: 'bg-purple-500',
  OPTIONS: 'bg-pink-500',
  PATCH: 'bg-yellow-500',
  POST: 'bg-blue-500',
  PUT: 'bg-cyan-500',
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

export function isHttpMethod(value: string): value is HttpMethods {
  if (!value) return false;
  return HttpMethodsArray.includes(value.toUpperCase() as HttpMethods);
}
