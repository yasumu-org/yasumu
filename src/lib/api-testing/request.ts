import { fetch } from '@tauri-apps/plugin-http';
import { HttpMethods } from '../constants';
import { IYasumuResponse, YasumuResponse } from './response';
import type { Yasumu } from './yasumu';
import { YasumuRequestAuthorization } from './authorization';
import { YasumuInterceptorManager } from './interceptors';

export type Primitives = string | number | boolean | null;
export type MaybeJSON = {
  toJSON(): JsonEncodable | JsonEncodable[];
};

export type JsonEncodable =
  | Exclude<Primitives, 'number'>
  | Record<string, Primitives | MaybeJSON>
  | MaybeJSON
  | JsonEncodable[];

export type Body = JsonEncodable | ArrayBuffer | FormData;

export interface IYasumuRequest {
  url: string;
  method: HttpMethods;
  headers: Headers;
  body: Body;
  abortController?: AbortController;
}

export class YasumuRequest {
  public configuration = {} as IYasumuRequest;
  public readonly id = crypto.randomUUID();
  public name = `${this.id}`;
  public readonly authorization: YasumuRequestAuthorization;
  public readonly interceptors: {
    pre: YasumuInterceptorManager<YasumuRequest> | null;
    post: YasumuInterceptorManager<YasumuResponse> | null;
  } = {
    post: null,
    pre: null,
  };

  public constructor(public readonly yasumu: Yasumu) {
    this.authorization = new YasumuRequestAuthorization(yasumu.authorization);
  }

  public get method() {
    return this.configuration.method?.toUpperCase() ?? HttpMethods.GET;
  }

  public setURL(url: string) {
    this.configuration.url = url;
    return this;
  }

  public setMethod(method: HttpMethods) {
    this.configuration.method = method;
    return this;
  }

  public setHeaders(headers: Headers) {
    this.configuration.headers = headers;
    return this;
  }

  public setBody(body: Body) {
    switch (true) {
      case body instanceof ArrayBuffer:
        this.configuration.body = body;
        break;
      case body instanceof FormData:
        this.configuration.body = body;
        break;
      default:
        this.configuration.body = JSON.stringify(body);
    }

    return this;
  }

  public get canAbort() {
    return (
      !!this.configuration.abortController &&
      !this.configuration.abortController.signal.aborted
    );
  }

  public cancel() {
    this.configuration.abortController?.abort();
  }

  public clone() {
    const req = new YasumuRequest(this.yasumu);

    req.configuration = { ...this.configuration };
    req.name = `${this.name} (Copy)`;
    req.authorization.type = this.authorization.type;
    req.authorization.value = this.authorization.value;

    return req;
  }

  public async send() {
    const auth = this.authorization.serialize();

    if (auth) {
      this.configuration.headers.set(auth.name, auth.value);
    }

    const interceptors =
      this.interceptors.pre || this.yasumu.interceptors.request;
    const request = interceptors.apply(this);
    const abortController = new AbortController();

    request.configuration.abortController = abortController;

    const start = Date.now();

    const response = await fetch(request.configuration.url, {
      method: request.configuration.method,
      headers: request.configuration.headers,
      body: (request.configuration.body || {}) as BodyInit,
      maxRedirections: 20,
      redirect: 'follow',
      connectTimeout: 60_000,
      signal: abortController.signal,
      credentials: 'omit',
      cache: 'no-store',
    });

    const responseTime = Math.abs(Date.now() - start);

    const body = await response.arrayBuffer();

    const data: IYasumuResponse = {
      body,
      responseTime,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      size: body.byteLength,
    };

    const result = new YasumuResponse().populate(data);

    const postInterceptors =
      this.interceptors.post || this.yasumu.interceptors.response;

    return postInterceptors.apply(result);
  }
}
