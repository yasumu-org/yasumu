import { KV } from '@/lib/kv';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';
import { create } from 'zustand';

interface IRequestStore {
  url: string;
  setURL: (url: string) => void;
  method: HttpMethod;
  setMethod: (method: HttpMethod) => void;
  headers: KV<string, string>;
  setHeaders: (headers: KV<string, string>) => void;
  parameters: KV<string, string>;
  setParameters: (headers: KV<string, string>) => void;
  body: BodyLike | null;
  setBody: (body: BodyLike | null) => void;
  title: string;
  setTitle: (title: string) => void;
}

export type BodyLike = string | Record<string, unknown>;
export type HttpMethod = keyof typeof HttpMethod;

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const;

export const useRequestStore = create<IRequestStore>((set) => ({
  body: null,
  method: HttpMethod.GET,
  headers: new KV<string, string>(),
  parameters: new KV<string, string>(),
  url: '',
  setHeaders: (headers) => set({ headers: headers.clone() }),
  setParameters: (parameters) => set({ parameters: parameters.clone() }),
  setBody: (body) => set({ body }),
  setMethod: (method) => set({ method: method.toUpperCase() as HttpMethod }),
  setURL: (url) => set({ url }),
  title: '',
  setTitle: (title) => set({ title }),
}));

export function useExecuteRequest() {
  const store = useRequestStore((store) => ({
    url: store.url,
    method: store.method,
    headers: store.headers,
    parameters: store.parameters,
  }));

  const execute = async () => {
    if (!store.url) return;

    try {
      const url = new URL(store.url);
      url.search = store.parameters.toString();

      await invoke('execute', {
        url,
        method: store.method,
        headers: store.headers.toJSON(),
      });
    } catch (e) {
      toast('Error constructing request', {
        description: `${e}`,
        dismissible: true,
      });
    }
  };

  return (): void => void execute();
}
