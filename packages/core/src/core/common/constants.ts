export type HttpMethods = (typeof HttpMethods)[keyof typeof HttpMethods];

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

export const BodyMode = {
  None: 'none',
  JSON: 'json',
  Text: 'text',
  Binary: 'binary',
  MultipartFormData: 'multipart-formdata',
  UrlencodedFormData: 'form-data-urlencoded',
} as const;

export type BodyMode = (typeof BodyMode)[keyof typeof BodyMode];

export interface BodyType {
  json?: string;
  text?: string;
  binary?: Uint8Array;
  formData?: Record<string, string>;
}
