import { HttpMethods } from '@/lib/constants';
import { create } from 'zustand';

export const useEnvironment = create((set) => ({
  environment: null as string | null,
  variables: {} as Record<string, string>,
  setEnvironment: (environment: string) => set({ environment }),
  setVariables: (variables: Record<string, string>) => set({ variables }),
}));

export interface IParamOrHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface IRequestConfig {
  url: string;
  method: HttpMethods;
  headers: IParamOrHeader[];
  body: string;
  setUrl: (url: string) => void;
  setMethod: (method: HttpMethods) => void;
  setHeaders: (headers: IParamOrHeader[]) => void;
  setBody: (body: string) => void;
}

export const useRequestConfig = create<IRequestConfig>((set) => ({
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  method: HttpMethods.GET,
  headers: [
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'User-Agent', value: 'Yasumu/1.0', enabled: true },
    { key: '', value: '', enabled: true },
  ] as IParamOrHeader[],
  body: '{\n  \n}',
  setUrl: (url: string) => set({ url }),
  setMethod: (method: HttpMethods) => set({ method }),
  setHeaders: (headers: IParamOrHeader[]) => set({ headers }),
  setBody: (body: string) => set({ body }),
}));
