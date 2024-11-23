import type { HttpMethod } from '@yasumu/common';
import type { WebRequestService } from './WebRequestService.js';
import type { KeyValue } from '@/common/types.js';
import { InteractiveWebResponse } from './InteractiveWebResponse.js';

export interface InteractiveWebRequestConfig {
  url: string;
  method: HttpMethod;
  headers?: KeyValue<string, string>[];
  body?: string | FormData | Record<string, unknown>;
  timeout?: number;
  maxRedirects?: number;
}

export class InteractiveWebRequest {
  public readonly url: URL;
  public readonly headers: Headers = new Headers();
  public readonly controller = new AbortController();

  public constructor(
    public readonly webRequest: WebRequestService,
    private config: InteractiveWebRequestConfig,
  ) {
    this.url = new URL(config.url);

    if (config.headers?.length) {
      for (const header of config.headers) {
        this.headers.append(header.key, header.value);
      }
    }
  }

  public get method() {
    return this.config.method;
  }

  public serializeBody() {
    if (this.config.body instanceof FormData) {
      return this.config.body;
    }

    if (typeof this.config.body === 'string') {
      return this.config.body;
    }

    return JSON.stringify(this.config.body);
  }

  public cancel() {
    this.controller.abort();
  }

  public async send() {
    const { fetch } = this.webRequest.workspace.yasumu;
    const { maxRedirects, timeout } = this.config;

    const start = Date.now();
    const res = await fetch(this.url.toString(), {
      maxRedirects,
      timeout,
      redirect: 'follow',
      method: this.method,
      headers: this.headers,
      body: this.serializeBody(),
      signal: this.controller.signal,
    });
    const end = Date.now();

    return new InteractiveWebResponse({
      status: res.status,
      headers: res.headers,
      body: res.body === null ? null : await res.text(),
      time: Math.abs(end - start),
      url: res.url,
      redirected: res.redirected,
    });
  }
}
