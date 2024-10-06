import { YasumuRestEntity, BodyMode, HttpMethods } from '@yasumu/core';
import { create } from 'zustand';

export interface IParamOrHeader {
  key: string;
  value: string;
  enabled: boolean;
}

export interface BodyType {
  json: string | null;
  text: string | null;
  binary: Uint8Array | null;
  formData: IParamOrHeader[];
  urlencoded: IParamOrHeader[];
}

export interface IRequestConfig {
  id: string;
  url: string;
  method: HttpMethods;
  headers: IParamOrHeader[];
  body: BodyType;
  bodyMode: BodyMode;
  script: string;
  setId: (id: string) => void;
  setUrl: (url: string) => void;
  setMethod: (method: HttpMethods) => void;
  setHeaders: (headers: IParamOrHeader[]) => void;
  setBody: (body: Partial<BodyType>) => void;
  setBodyMode: (bodyMode: BodyMode) => void;
  setScript: (script: string) => void;
  clearRequestData: () => void;
  applyRequestData: (data: YasumuRestEntity) => void;
}

export const useRequestConfig = create<IRequestConfig>((set) => ({
  id: '',
  url: '',
  method: HttpMethods.GET,
  headers: [
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'User-Agent', value: 'Yasumu/1.0', enabled: true },
    { key: '', value: '', enabled: true },
  ] as IParamOrHeader[],
  body: {
    binary: null,
    formData: [],
    json: null,
    text: null,
    urlencoded: [],
  },
  bodyMode: BodyMode.None,
  script: '',
  setId: (id: string) => set({ id }),
  setUrl: (url: string) => set({ url }),
  setMethod: (method: HttpMethods) => set({ method }),
  setHeaders: (headers: IParamOrHeader[]) => set({ headers }),
  setBody: (body: Partial<BodyType>) => set((old) => ({ body: { ...old.body, ...body } })),
  setBodyMode: (bodyMode: BodyMode) => set({ bodyMode }),
  setScript: (script: string) => set({ script }),
  clearRequestData() {
    set({
      id: '',
      url: '',
      method: HttpMethods.GET,
      headers: [
        { key: 'Content-Type', value: 'application/json', enabled: true },
        { key: 'User-Agent', value: 'Yasumu/1.0', enabled: true },
        { key: '', value: '', enabled: true },
      ],
      body: {
        binary: null,
        formData: [],
        json: null,
        text: null,
        urlencoded: [],
      },
      bodyMode: BodyMode.None,
      script: '',
    });
  },
  applyRequestData: (data: YasumuRestEntity) => {
    set({
      id: data.getPath(),
      url: data.getUrl(),
      method: data.getMethod(),
      headers: data.getHeaders().map((header) => ({
        key: header.key,
        value: header.value,
        enabled: true,
      })),
      body: {
        binary: data.getBody()?.binary ?? null,
        // formData: data.getBody()?.formData ?? [],
        formData: [],
        json: data.getBody()?.json ?? null,
        text: data.getBody()?.text ?? null,
        // urlencoded: data.getBody()?.urlencoded ?? [],
        urlencoded: [],
      },
      bodyMode: BodyMode.None,
      script: data.getPreRequestScript(),
    });
  },
}));

export interface IRequestStore {
  current: YasumuRestEntity | null;
  setCurrent: (current: YasumuRestEntity | null) => void;
  focused: YasumuRestEntity | null;
  setFocused: (focused: YasumuRestEntity | null) => void;
}

export const useRequestStore = create<IRequestStore>((set) => ({
  current: null,
  setCurrent: (current) => set({ current }),
  focused: null,
  setFocused: (focused) => set({ focused }),
}));

export interface IRequestFs {
  copied: string | null;
  cut: string | null;
  selectedPath: string | null;
  setCopied: (copied: string | null) => void;
  setCut: (cut: string | null) => void;
  setSelectedPath: (selectedPath: string | null) => void;
}

export const useRequestFs = create<IRequestFs>((set) => ({
  copied: null,
  cut: null,
  selectedPath: null,
  setCopied: (copied) => set({ copied }),
  setCut: (cut) => set({ cut }),
  setSelectedPath: (selectedPath) => set({ selectedPath }),
}));
