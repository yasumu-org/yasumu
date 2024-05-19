export interface IHttpMethod {
  name: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
  color: string;
}

export const HttpMethods: IHttpMethod[] = [
  { name: 'GET', color: 'text-green-500' },
  { name: 'DELETE', color: 'text-red-500' },
  { name: 'HEAD', color: 'text-purple-500' },
  { name: 'OPTIONS', color: 'text-pink-500' },
  { name: 'PATCH', color: 'text-yellow-500' },
  { name: 'POST', color: 'text-blue-500' },
  { name: 'PUT', color: 'text-cyan-500' },
];
