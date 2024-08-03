import { HttpMethods } from '@/lib/constants';
import type { YasumuRest } from './YasumuRest';
import { writeTextFile } from '@tauri-apps/plugin-fs';

export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export interface YasumuRestEntityResponseCache {
  status: number;
  size: number;
  headers: Array<KeyValue<string, string>>;
  body: string;
}

export interface YasumuRestEntityData {
  name: string;
  method: HttpMethods;
  url: string;
  headers: Array<KeyValue<string, string>>;
  body: string | null;
  path: string;
  response: YasumuRestEntityResponseCache | null;
}

export class YasumuRestEntity {
  #changed = false;

  public constructor(
    public readonly rest: YasumuRest,
    private data: YasumuRestEntityData
  ) {}

  public getName() {
    return this.data.name;
  }

  public setName(name: string) {
    if (this.data.name !== name) {
      this.#changed = true;
    }

    this.data.name = name;
  }

  public getMethod() {
    return this.data.method;
  }

  public setMethod(method: HttpMethods) {
    if (this.data.method !== method) {
      this.#changed = true;
    }

    this.data.method = method;
  }

  public getUrl() {
    return this.data.url;
  }

  public setUrl(url: string) {
    if (this.data.url !== url) {
      this.#changed = true;
    }

    this.data.url = url;
  }

  public getHeaders() {
    return this.data.headers;
  }

  public setHeaders(headers: Array<KeyValue<string, string>>) {
    if (this.data.headers !== headers) {
      this.#changed = true;
    }

    this.data.headers = headers;
  }

  public getBody() {
    return this.data.body;
  }

  public setBody(body: string | null) {
    if (this.data.body !== body) {
      this.#changed = true;
    }

    this.data.body = body;
  }

  public getPath() {
    return this.data.path;
  }

  public getResponse() {
    return this.data.response;
  }

  public setResponse(response: YasumuRestEntityResponseCache | null) {
    if (this.data.response !== response) {
      this.#changed = true;
    }

    this.data.response = response;
  }

  public save() {
    const data = JSON.stringify(this.data);
    return writeTextFile(this.data.path, data);
  }

  public static getName(name: string) {
    return name.split('.').shift() ?? null;
  }

  public static getMethod(name: string) {
    return name.split('.').pop() as HttpMethods;
  }
}
